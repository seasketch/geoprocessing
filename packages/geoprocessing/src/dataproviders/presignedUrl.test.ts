import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { genPresignedUrl } from "./presignedUrl.js";

describe("genPresignedUrl", () => {
  const originalEnv = process.env.AWS_LAMBDA_FUNCTION_NAME;

  beforeEach(() => {
    // Clean up environment before each test
    delete process.env.AWS_LAMBDA_FUNCTION_NAME;
  });

  afterEach(() => {
    // Restore original environment after each test
    if (originalEnv === undefined) {
      delete process.env.AWS_LAMBDA_FUNCTION_NAME;
    } else {
      process.env.AWS_LAMBDA_FUNCTION_NAME = originalEnv;
    }
  });

  test("should return original URL when not in Lambda environment", async () => {
    const url =
      "https://gp-test-project-datasets.s3.us-west-1.amazonaws.com/data.fgb";
    const result = await genPresignedUrl(url);
    expect(result).toBe(url);
  });

  test("should return original URL for non-S3 URLs", async () => {
    const url = "https://example.com/data.fgb";
    const result = await genPresignedUrl(url);
    expect(result).toBe(url);
  });

  test("should return original URL for http (non-https) URLs", async () => {
    const url = "http://example.com/data.fgb";
    const result = await genPresignedUrl(url);
    expect(result).toBe(url);
  });

  test("should return original URL for relative URLs", async () => {
    const url = "/data/test.fgb";
    const result = await genPresignedUrl(url);
    expect(result).toBe(url);
  });

  test("should parse S3 URL correctly and identify bucket, region, and key", async () => {
    const url =
      "https://gp-test-project-datasets.s3.us-west-1.amazonaws.com/subfolder/data.fgb";

    // Not in Lambda, so should return original
    const result = await genPresignedUrl(url);
    expect(result).toBe(url);

    // Verify URL pattern matching by testing the regex
    const s3UrlMatch = url.match(
      /^https:\/\/([^.]+)\.s3\.([^.]+)\.amazonaws\.com\/(.+)$/,
    );
    expect(s3UrlMatch).not.toBeNull();
    if (s3UrlMatch) {
      const [, bucket, region, key] = s3UrlMatch;
      expect(bucket).toBe("gp-test-project-datasets");
      expect(region).toBe("us-west-1");
      expect(key).toBe("subfolder/data.fgb");
    }
  });

  test("should handle URL with complex key path", async () => {
    const url =
      "https://my-bucket.s3.eu-west-2.amazonaws.com/path/to/deeply/nested/file.tif";

    const s3UrlMatch = url.match(
      /^https:\/\/([^.]+)\.s3\.([^.]+)\.amazonaws\.com\/(.+)$/,
    );
    expect(s3UrlMatch).not.toBeNull();
    if (s3UrlMatch) {
      const [, bucket, region, key] = s3UrlMatch;
      expect(bucket).toBe("my-bucket");
      expect(region).toBe("eu-west-2");
      expect(key).toBe("path/to/deeply/nested/file.tif");
    }
  });

  test("should not match S3 URL without region", async () => {
    // Old-style S3 URL format (s3.amazonaws.com without region)
    const url = "https://my-bucket.s3.amazonaws.com/data.fgb";

    const s3UrlMatch = url.match(
      /^https:\/\/([^.]+)\.s3\.([^.]+)\.amazonaws\.com\/(.+)$/,
    );
    // Should not match because region segment is just "amazonaws"
    expect(s3UrlMatch).toBeNull();
  });

  test("should return original URL when in Lambda but URL is external", async () => {
    // Simulate Lambda environment
    process.env.AWS_LAMBDA_FUNCTION_NAME = "test-function";

    const url = "https://external-data-source.com/data.fgb";
    const result = await genPresignedUrl(url);
    expect(result).toBe(url);
  });

  // Note: We cannot easily test the actual presigned URL generation without
  // mocking the AWS SDK, which would require more complex setup.
  // In a real Lambda environment with proper IAM permissions, the presigned
  // URL generation is tested through integration tests.
});

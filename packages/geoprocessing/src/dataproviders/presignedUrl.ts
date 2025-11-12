import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Generates a presigned URL for an S3 object if running in Lambda environment
 * and the URL points to an S3 bucket. Otherwise returns the original URL.
 *
 * @param url - The S3 URL to potentially convert to a presigned URL
 * @param expiresIn - Number of seconds until the presigned URL expires (default: 3600 = 1 hour)
 * @returns Presigned URL if in Lambda with S3 URL, otherwise original URL
 */
export async function genPresignedUrl(
  url: string,
  expiresIn: number = 900,
): Promise<string> {
  // Only generate presigned URLs when running in Lambda (not in test or local dev)
  const isLambda = process.env.AWS_LAMBDA_FUNCTION_NAME !== undefined;

  if (!isLambda) {
    return url;
  }

  // Check if this is an S3 URL that needs signing
  const s3UrlMatch = url.match(
    /^https:\/\/([^.]+)\.s3\.([^.]+)\.amazonaws\.com\/(.+)$/,
  );

  if (!s3UrlMatch) {
    // Not an S3 URL, return as-is
    return url;
  }

  const [, bucket, region, key] = s3UrlMatch;

  try {
    const client = new S3Client({ region });
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const presignedUrl = await getSignedUrl(client, command, { expiresIn });

    if (process.env.NODE_ENV !== "test") {
      console.log(`Generated presigned URL for s3://${bucket}/${key}`);
    }

    return presignedUrl;
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    throw new Error(
      `Failed to generate presigned URL for ${url}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

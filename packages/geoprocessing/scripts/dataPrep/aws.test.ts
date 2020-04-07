// @ts-ignore
import AWS from "aws-sdk";
jest.mock("node-fetch", () => require("fetch-mock-jest").sandbox());
const fetchMock = require("node-fetch");
import { getDataSourceVersion } from "./aws";

const NAME = "dataset-name";
const PKGNAME = "seasketchgeoprocessing-data-sources";
const REGION = "us-west-2";
AWS.config.update({
  region: REGION
});

describe("getDataSourceVersion", () => {
  test("recognizes missing buckets", async () => {
    fetchMock.getOnce(
      `https://${PKGNAME}-${NAME}.s3-${REGION}.amazonaws.com/metadata.json`,
      301
    );
    const version = await getDataSourceVersion(NAME);
    expect(version).toBe(0);
  });

  test("recognizes existing version of DataSource", async () => {
    fetchMock.getOnce(
      `https://${PKGNAME}-${NAME}.s3-${REGION}.amazonaws.com/metadata.json`,
      {
        version: 12
      },
      {
        overwriteRoutes: true
      }
    );
    const version = await getDataSourceVersion(NAME);
    expect(version).toBe(12);
  });
});

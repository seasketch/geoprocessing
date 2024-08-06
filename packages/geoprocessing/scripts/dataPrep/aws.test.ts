import { getDataSourceVersion } from "./aws.js";

const NAME = "dataset-name";

describe("getDataSourceVersion", () => {
  test.skip("recognizes missing buckets", async () => {
    // fetchMock.getOnce(`https://${NAME}.s3.amazonaws.com/metadata.json`, 301);
    const version = await getDataSourceVersion(NAME);
    expect(version.currentVersion).toBe(0);
  });

  test.skip("recognizes existing version of DataSource", async () => {
    // fetchMock.getOnce(
    //   `https://${NAME}.s3.amazonaws.com/metadata.json`,
    //   {
    //     version: 16,
    //   },
    //   {
    //     overwriteRoutes: true,
    //   }
    // );
    const version = await getDataSourceVersion(NAME);
    expect(version.currentVersion).toBe(16);
  });
});

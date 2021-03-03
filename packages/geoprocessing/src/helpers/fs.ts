import fs from "fs";

export function toJsonFile(data, filename) {
  fs.writeFile(filename, JSON.stringify(data, null, 2), (err) =>
    err
      ? console.error("Error", err)
      : console.info(`Successfully wrote ${filename}`)
  );
}

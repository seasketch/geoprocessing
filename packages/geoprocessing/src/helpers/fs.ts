import fs from "node:fs";

export function toJsonFile(data, filename) {
  fs.writeFile(filename, JSON.stringify(data, null, 2), (err) => {
    if (err) throw new Error(err.message);
  });
}

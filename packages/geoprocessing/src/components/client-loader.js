/**
 * @returns all clients as a single module for bundling by webpack
 */

const code = `export default {
  ${options.clients
    .map((client) => {
      console.log("client", client.source);
      return `"${client.name}": await import("${client.source}")`;
    })
    .join(",\n")}
}`;

console.log(code);

const loader = (options, loaderContext) => {
  return {
    code,
  };
};

export default loader;

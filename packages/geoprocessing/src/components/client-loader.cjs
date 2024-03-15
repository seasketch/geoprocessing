/**
 * @returns all clients as a single CommonJS module for bundling by webpack
 */
module.exports = (options, loaderContext) => {
  return {
    code: `module.exports = {
      ${options.clients
        .map((client) => {
          console.log("client", client.source);
          return `"${client.name}": require("${client.source}").default`;
        })
        .join(",\n")}
    }`,
  };
};

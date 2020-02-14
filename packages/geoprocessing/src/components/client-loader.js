module.exports = (options, loaderContext) => {
  return {
    code: `module.exports = {
      ${options.clients
        .map(client => {
          return `"${client.name}": require("../../${client.source}").default`;
        })
        .join(",\n")}
    }`
  };
};

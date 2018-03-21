const replace = require("rollup-plugin-replace");
const dependencies = require("./package.json").dependencies;

export default {
  input: "./src/index.js",
  output: {
    name: "rollup",
    file: "dist/bundle.js",
    format: "umd",
    globals: Object.keys(dependencies).reduce(
      (o, key) => Object.assign(o, { [key]: key }),
      {}
    ),
    banner: "#!/usr/bin/env node"
  },
  plugins: [replace({ "#!/usr/bin/env node": "" })],
  external: Object.keys(dependencies).map(mod => mod)
};

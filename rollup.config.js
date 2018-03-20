const replace = require("rollup-plugin-replace");
const dependencies = require("./package.json").dependencies;

export default {
  entry: "./src/index.js",
  banner: "#!/usr/bin/env node",
  plugins: [replace({ "#!/usr/bin/env node": "" })],
  moduleName: "rollup",
  targets: [{ dest: "dist/bundle.js", format: "umd" }],
  external: Object.keys(dependencies).map(mod => mod),
  globals: Object.keys(dependencies).reduce(
    (o, key) => Object.assign(o, { [key]: key }),
    {}
  )
};

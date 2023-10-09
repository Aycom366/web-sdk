import typescript from "rollup-plugin-typescript2";
import terser from "@rollup/plugin-terser";
import json from "@rollup/plugin-json";
import pkg from "./package.json" assert { type: "json" };

export default {
  input: "./src/index.ts",
  output: {
    file: pkg.main,
    name: pkg.name,
    format: "umd",
    sourcemap: true,
  },
  plugins: [
    json(),
    typescript(),
    terser({
      output: {
        comments: false,
      },
    }),
  ],
};

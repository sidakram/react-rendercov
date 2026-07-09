// libs
import fs from "node:fs";
import { type UserConfig, defineConfig } from "tsdown";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

const banner = `/**
 * @license react-rendercov-playwright
 *
 * Copyright (c) Mohammad Akram, github@sidakram
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */`;

const sharedOptions: UserConfig = {
  hash: false,
  entry: [],
  banner: {
    js: banner,
  },
  clean: false,
  outDir: "./dist",
  sourcemap: true,
  format: [],
  platform: "browser",
  target: "esnext",
  treeshake: true,
  dts: true,
  minify: true,
  deps: {
    neverBundle: ["react", "react-dom", "@playwright/test", "react-reconciler"],
  },
  env: {
    NODE_ENV: process.env.NODE_ENV ?? "development",
  },
  define: {
    "process.env.VERSION": JSON.stringify(pkg.version),
  },
};

export default defineConfig([
  {
    ...sharedOptions,
    format: ["esm", "cjs"],
    entry: {
      index: "./src/index.ts",
    },
    clean: true,
  },
  {
    ...sharedOptions,
    platform: "node",
    format: ["esm"],
    entry: {
      playwright: "./src/playwright.ts",
    },
    clean: true,
  },
]);

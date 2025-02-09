// libs
import fs from 'node:fs';
import { type Options, defineConfig } from 'tsup';

const banner = `/**
 * @license react-rendercov-playwright
 *
 * Copyright (c) Mohammad Akram, github@sidakram
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */`;

const DEFAULT_OPTIONS: Options = {
    entry: [],
    banner: {
        js: banner,
    },
    clean: false,
    outDir: './dist',
    splitting: false,
    sourcemap: false,
    format: [],
    target: 'esnext',
    treeshake: true,
    dts: true,
    minify: true,
    env: {
        NODE_ENV: process.env.NODE_ENV ?? 'development',
        VERSION: JSON.parse(fs.readFileSync('package.json', 'utf8')).version,
    },
    external: ['react', 'react-dom', '@playwright/test'],
};

export default defineConfig([
    {
        ...DEFAULT_OPTIONS,
        format: ['cjs', 'esm'],
        entry: ['./src/index.ts', './src/playwright.ts'],
        platform: 'node',
        target: 'es2015',
        splitting: true,
        clean: true, // only run on first entry
    },
    {
        ...DEFAULT_OPTIONS,
        format: ['iife'],
        entry: ['./src/index.ts'],
        platform: 'browser',
        target: 'es2015',
        splitting: true,
        clean: true, // only run on first entry
    },
]);

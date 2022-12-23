import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';


export default [
    {
        input: "extension/src/background.js",
        output: {
            sourcemap: true,
            format: "iife",
            file: "extension/public/build/background.js",
        },
        plugins: [resolve(), commonjs()],
        watch: {
            clearScreen: false,
        },
    },
    {
        input: "extension/src/injection.js",
        output: {
            sourcemap: true,
            format: "iife",
            file: "extension/public/build/injection.js",
        },
        plugins: [json({ compact: true }), resolve(), commonjs()],
        watch: {
            clearScreen: false,
        },
    },
];

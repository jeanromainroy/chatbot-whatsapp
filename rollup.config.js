import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';


export default [
    {
        input: "src/background.js",
        output: {
            sourcemap: true,
            format: "iife",
            file: "public/build/background.js",
        },
        plugins: [resolve(), commonjs()],
        watch: {
            clearScreen: false,
        },
    },
    {
        input: "src/injection.js",
        output: {
            sourcemap: true,
            format: "iife",
            file: "public/build/injection.js",
        },
        plugins: [json({ compact: true }), resolve(), commonjs()],
        watch: {
            clearScreen: false,
        },
    },
];

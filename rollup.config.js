import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';


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
        plugins: [resolve(), commonjs()],
        watch: {
            clearScreen: false,
        },
    },
];

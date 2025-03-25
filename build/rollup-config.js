// Config file for running Rollup in "normal" mode (non-watch)

import json from 'rollup-plugin-json';
import pkg from '../package.json';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';

let { version } = pkg;
let release;

// Skip the git branch+rev in the banner when doing a release build
if (process.env.NODE_ENV === 'release') {
    release = true;
} else {
    release = false;
}

const banner = `/* @preserve
 * LatLon v1.0, a JS library for parsing and formatting coordinates.
 * (c) 2019-2020 Jiri Richter
 */
`;

const outro = `var oldLatLon = window.LatLon;
exports.noConflict = function() {
	window.LatLon = oldLatLon;
	return this;
}

// Always export us to window global (see #2364)
window.LatLon = exports;`;

export default {
    input: 'src/index.js',
    output: [
        {
            file: pkg.main,
            format: 'umd',
            name: 'LatLon',
            banner: banner,
            outro: outro,
            sourcemap: true
        }
    ],
    plugins: [
        resolve(),
        babel({
            exclude: 'node_modules/**' // only transpile our source code
        }),
        commonjs(),
        json()
    ]
};

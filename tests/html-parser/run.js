'use strict';

// config
const path_test_1 = './tests/html-parser/locale1.html';
const path_test_2 = './tests/html-parser/locale2.html';

// libs
import { readFileSync } from 'fs';
import { extract_posts } from '../../extension/src/scripts/extractor.js';


async function main() {

    // load file
    const test_1 = readFileSync(path_test_1, 'utf8');
    const test_2 = readFileSync(path_test_2, 'utf8');

    // extract posts
    const posts_1 = extract_posts(test_1);
    console.log(posts_1[0]);

    const posts_2 = extract_posts(test_2);
    console.log(posts_2[0]);
}

main();

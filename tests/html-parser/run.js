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
    const posts_2 = extract_posts(test_2);

    // filter by 'received'
    const posts_1_received = posts_1.filter(post => post['direction'] === 'in');
    const posts_2_received = posts_2.filter(post => post['direction'] === 'in');

    // log
    console.log(posts_1_received[posts_1_received.length-1]);
    console.log(posts_2_received[posts_2_received.length-1]);
}

main();

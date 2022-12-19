'use strict';

// libs
import { readFileSync } from 'fs';
import { Extractor } from '../../src/scripts/extractor.js';

// config
const path = './tests/html-parser/example.html';


async function main() {

    // load file
    const html_str = readFileSync(path, 'utf8');

    // init instance of extractor
    const extractor = new Extractor('Pravda_Gerashchenko');

    // init variables
    let already_extracted_post_ids = new Set();

    // extract posts
    const { posts } = await extractor.extract_posts(html_str, already_extracted_post_ids);

    posts.forEach(post => {
        console.log(post)
        // post['images'].forEach(url => {
        //     if (url.includes('blob:https://web.telegram.org/')) urls.add(url);
        // })
    });
}


main();

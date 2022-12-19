'use strict';

// import scripts
import { APP_NAME } from './env.js';
import { Extractor } from './scripts/extractor.js';

// process var
let already_extracted_post_ids = new Set();
let nbr_of_posts_scraped = 0;
let conversation = [];


function get_current_url() {
    return window.location.href;
}


async function scrape(){

    // get url
    const url = window.location.href;

    // check
    if (!url.includes('web.whatsapp.com')) return;

    // init instance of extractor
    const extractor = new Extractor();

    // grab page HTML
    const html_str = document.body.innerHTML;

    // extract posts
    const { posts } = await extractor.extract_posts(html_str, already_extracted_post_ids);

    // go through posts
    posts.forEach(post => {

        // if already extracted, skip
        if(already_extracted_post_ids.has(post.post_id)) return;

        // add post id to already extracted
        already_extracted_post_ids.add(post.post_id)

        // add post to conversation
        conversation.push(post)
    })

    // if we now have a different number of posts
    if(Object.keys(conversation).length !== nbr_of_posts_scraped){

        // update nbr value
        nbr_of_posts_scraped = conversation.length;

        // inform user
        console.log(`${APP_NAME} - Number of posts scraped = ${nbr_of_posts_scraped}`);
    }
}


// message interface
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        switch(message.type) {
            case "currentPage":
                console.log(`${APP_NAME} - url requested`)
                sendResponse(get_current_url());
                break;
            
            case "startScrape":
                console.log(`${APP_NAME} - scraping`)
                scrape();
                break;
            
            case "requestConversation": 
                console.log(`${APP_NAME} - gpt requested`);
                sendResponse(conversation);
                break;

            default:
                console.error("Unrecognised message: ", message);
        }
    }
);

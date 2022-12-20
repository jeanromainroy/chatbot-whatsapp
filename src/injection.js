'use strict';

// import scripts
import { APP_NAME } from './env.js';
import { Extractor } from './scripts/extractor.js';
import { sleep } from './libs/system.js';

// process var
let already_extracted_post_ids = new Set();
let nbr_of_posts_scraped = 0;
let conversation = [];

// init instance of extractor
const extractor = new Extractor();


function get_current_url() {
    return window.location.href;
}


async function scrape(){

    // get url
    const url = window.location.href;

    // check
    if (!url.includes('web.whatsapp.com')) return;

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


async function post(message){
    
    // select the textarea
    const textbox = document.querySelector('footer').querySelector('[role="textbox"]');

    // focus
    textbox.focus(); 

    // paste text
    // TODO: FIX DEPRECATED
    let pasted = true;
    try {
        if (!document.execCommand("insertText", false, message)) {
            pasted = false;
        }
    } catch (err) {
        console.error(err);
        pasted = false;
    }

    // check if successful
    if (!pasted) {
        console.error("paste unsuccessful, execCommand not supported");
        return;
    }

    // wait a bit
    await sleep(300);

    // select the send button
    const button = document.querySelector('footer').querySelector('button[aria-label="Send"]');

    // trigger send button
    button.click();
}



// message interface
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        switch(message.type) {
            case "currentPage":
                console.log(`${APP_NAME} - url requested`)
                sendResponse(get_current_url());
                break;
            
            case "startScrape":
                // console.log(`${APP_NAME} - scraping`)
                scrape();
                break;
            
            case "requestConversation": 
                // console.log(`${APP_NAME} - gpt requested`);
                sendResponse(conversation);
                break;

            case "respondWith": 
                console.log(`${APP_NAME} - response received`);
                post(message.data);
                break;

            default:
                console.error("Unrecognised message: ", message);
        }
    }
);

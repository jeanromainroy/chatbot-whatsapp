'use strict';

// import scripts
import { APP_NAME } from '../../config.js';
import { extract_posts } from './scripts/extractor.js';
import { sleep } from './libs/system.js';


function get_current_url() {
    return window.location.href;
}


function get_most_recent_post(){

    // get url
    const url = window.location.href;

    // check
    if (!url.includes('web.whatsapp.com')) return null;

    // grab page HTML
    const html_str = document.body.innerHTML;

    // extract posts
    const posts = extract_posts(html_str);

    // check
    if (posts === undefined || posts === null || !Array.isArray(posts) || posts.length === 0) return null;

    // set most recent post
    const most_recent_post = posts[posts.length-1];

    // check
    if (most_recent_post === undefined || most_recent_post === null || typeof(most_recent_post) !== 'object') return null;

    return most_recent_post;
}


async function clear(){

    // select the textarea
    const textbox = document.querySelector('footer').querySelector('[role="textbox"]');

    // focus
    textbox.focus(); 

    // select all 
    try {
        document.execCommand("selectAll", false, null);
        document.execCommand("cut", false, null);
    } catch (err) {
        console.error(`${APP_NAME} - exec command not supported`)
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
        console.error(`${APP_NAME} - paste unsuccessful, execCommand not supported`);
        return;
    }

    // wait a bit
    await sleep(500);

    // select the send button
    const button = document.querySelector('footer').querySelector('button[aria-label="Send"]');

    // check
    if (button === undefined || button === null) {
        console.error(`${APP_NAME} - button not loaded`);
        clear();
        return;
    }

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
            
            case "getMostRecentPost": 
                console.log(`${APP_NAME} - chat requested`);
                sendResponse(get_most_recent_post());
                break;

            case "postMessage": 
                console.log(`${APP_NAME} - response received`);
                post(message.data);
                break;

            default:
                console.error("Unrecognised message: ", message);
        }
    }
);

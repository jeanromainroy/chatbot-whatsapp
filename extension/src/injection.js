'use strict';

// import scripts
import { APP_NAME } from '../../config.js';
import { extract_posts } from './scripts/extractor.js';
import { sleep } from './libs/system.js';


function is_whatsapp() {
    const url = window.location.href;
    return url.includes('web.whatsapp.com');
}


function read_all() {

    // grab page HTML
    let html_str = null;
    try {
        html_str = document.body.innerHTML;
    } catch(err) {
        console.error(`${APP_NAME} - could not grab document body`)
        return null;
    }

    // extract posts from html
    const posts = extract_posts(html_str);

    // check
    if (posts === undefined || posts === null || !Array.isArray(posts) || posts.length === 0) return null;

    return posts;
}


function get_last_post_received(){

    // extract posts
    const posts = read_all();

    // check
    if (posts === null) return null;

    // filter by 'received'
    const posts_received = posts.filter(post => post['direction'] === 'in');

    // check
    if (posts_received.length === 0) return null;

    // return last posts
    return posts_received[posts_received.length-1];
}


function clear_textbox() {

    // select the textarea
    const textbox = document.querySelector('footer').querySelector('[role="textbox"]');

    // focus
    textbox.focus(); 

    // init
    let success = true;

    try {
        
        // select all 
        if(!document.execCommand("selectAll", false, null)) success = false;
        
        // cut
        if(success && !document.execCommand("cut", false, null)) success = false;

    } catch (err) {
        console.error(err);
        success = false;
    }

    // check
    if (!success) console.error(`${APP_NAME} - could not clear textbox`);

    return success;
}


function insert_textbox(message) {

    // select the textarea
    const textbox = document.querySelector('footer').querySelector('[role="textbox"]');

    // focus
    textbox.focus(); 

    // init
    let success = true;

    try {

        // insert text 
        if(!document.execCommand("insertText", false, message)) success = false;

    } catch (err) {
        console.error(err);
        success = false;
    }

    // check
    if (!success) console.error(`${APP_NAME} - could not insert into textbox`);

    return success;
}


async function send_textbox() {

    // init
    let success = false;

    // three attempts
    for (let i=0 ; i<3 ; i++) {

        // wait a bit
        await sleep(300);

        // set the send button
        const button = document.querySelector('footer').querySelector('button[aria-label="Send"]');
        
        // if button wasn't selected, try again
        if (button === undefined || button === null) continue;

        // trigger send button
        button.click();

        // set flag
        success = true;

        // stop
        break;
    }

    // if failed
    if (!success) {
        console.error(`${APP_NAME} - button could not be selected`);
        clear_textbox();
    }    
}


async function submit(message){

    // insert text
    if(!insert_textbox(message)) return;

    // submit text
    await send_textbox();
}



// message interface
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
        switch(message.type) {
            case "isWhatsApp":
                console.log(`${APP_NAME} - url requested`)
                sendResponse(is_whatsapp());
                break;
            
            case "getLastPostReceived": 
                console.log(`${APP_NAME} - last post requested`);
                sendResponse(get_last_post_received());
                break;

            case "submitPost": 
                console.log(`${APP_NAME} - post submission requested`);
                submit(message.data);
                break;

            case "acknowledge": 
                console.log(`${APP_NAME} - acknowledgement requested`);
                insert_textbox('');
                break;

            default:
                console.error(`${APP_NAME} - Unrecognised message: `, message);
        }
    }
);

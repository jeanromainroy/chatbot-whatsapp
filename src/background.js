'use strict';

// import config
import { APP_NAME, REFRESH_MS } from '../config.js';

// import libs
import { ChatBot } from './scripts/chatbot.js';

// process var
let already_started = false;
let counter = 0;


// helper function to send messages to injected scripts
async function sendMessage(tabId, messageType, data = null){
    return chrome.tabs.sendMessage(tabId, { type: messageType, data: data }, null);
}


async function start(tabId) {

    // init bot
    const chatbot = new ChatBot(tabId);

    // regurlaly request conversation from convo
    setInterval(async () => {

        // run
        await chatbot.run();

    }, REFRESH_MS)
}



chrome.tabs.onUpdated.addListener(async function(tabId) {

    // check flag
    if (already_started) return;

    // page url
    const url = await sendMessage(tabId, "currentPage");

    // check
    if (url === undefined || url === null) return;

    // check if supported
    if(!url.includes('web.whatsapp.com')) return;

    // set flag
    already_started = true;

    // start chatbot
    start(tabId);
});

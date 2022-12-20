'use strict';

// import config
import { APP_NAME, REFRESH_MS, VERIFIER_MS } from './env.js';

// import libs
import { sleep } from './libs/system.js';
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
    while(true) {

        // wait a bit
        await sleep(REFRESH_MS);

        // run
        await chatbot.run();

        // increment
        counter = ( counter + 1 ) % 100;
    }
}


async function monitor(tabId) {

    // init proc var
    let previous_value = 0;
    let frozen_counter = 0;

    // start monitoring
    setInterval(() => {

        // if frozen
        if (counter === previous_value) {
            frozen_counter += 1;
        }

        // if more than X frozen, means the thing exited
        if (frozen_counter > 3) {
            frozen_counter = 0;
            console.log(`${APP_NAME} - restarting chatbot`);
            start(tabId);
        }
        
    }, VERIFIER_MS);
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

    // monitor chatbot
    monitor();
});


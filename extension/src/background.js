'use strict';

// import config
import { REFRESH_MS } from '../../config.js';

// import libs
import { ChatBot } from './scripts/chatbot.js';

// process var
let active_tab_ids = new Set();


// helper function to send messages to injected scripts
async function sendMessage(tabId, messageType, data = null){
    return chrome.tabs.sendMessage(tabId, { type: messageType, data: data }, null);
}


async function start(tabId) {

    // check
    if (active_tab_ids.has(tabId)) return;

    // add
    active_tab_ids.add(tabId);

    // init bot
    const chatbot = new ChatBot(tabId);

    // regurlaly request conversation from convo
    setInterval(async () => {

        // run
        await chatbot.run();

    }, REFRESH_MS)
}


chrome.tabs.onUpdated.addListener(async function(tabId) {

    // page url
    const is_whatsapp = await sendMessage(tabId, "isWhatsApp");

    // check
    if (is_whatsapp === undefined || is_whatsapp === null || is_whatsapp !== true) return;

    // start chatbot
    start(tabId);
});

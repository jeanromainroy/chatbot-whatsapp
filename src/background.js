'use strict';

// import libs
import { request_POST } from './scripts/helper.js';
import { return_locale_date_now_in_ISO_format } from './scripts/dt.js';

// import config
import { APP_NAME, ENDPOINT_PROMPT, REFRESH_MS } from './env.js';

// process var
let post_ids_processed = new Set();

// date on startup
const date_startup = return_locale_date_now_in_ISO_format();
const year_startup = date_startup['year'];
const month_startup = date_startup['month'];
const day_startup = date_startup['day'];
const hours_startup = date_startup['hours'];
const minutes_startup = date_startup['minutes'];


chrome.tabs.onActivated.addListener(async function(info) {

    // define helper function
    async function sendMessage(messageType){
        return chrome.tabs.sendMessage(info.tabId, { type: messageType }, null);
    }

    // page url
    const url = await sendMessage("currentPage");

    // check
    if (url === undefined || url === null) return;

    // check if supported
    if(!url.includes('web.whatsapp.com')) return;

    // regurlaly request conversation from convo
    setInterval(async () => {
        console.log(`${APP_NAME} - running`);

        // inject scraper
        try {
            await sendMessage("startScrape");
        } catch (err) {
            return;
        }

        // request conversation from injected script
        let response = null;
        try {
            response = await sendMessage('requestConversation');
        } catch (err) {
            return;
        }

        // check
        if (response === undefined || response === null || !Array.isArray(response)) return;

        // append
        response.forEach(async (post) => {

            // destructure
            const { post_id, sender, text, year, month, day, hours, minutes } = post;

            // skip if conversation already has this post
            if (post_ids_processed.has(post_id)) return;

            // add
            post_ids_processed.add(post_id);

            // skip if message is older than app startup
            if (year < year_startup) return;
            if (year === year_startup) { if (month < month_startup) return; }
            if (year === year_startup && month === month_startup) { if (day < day_startup) return; }
            if (year === year_startup && month === month_startup && day === day_startup) { if (hours < hours_startup) return; }
            if (year === year_startup && month === month_startup && day === day_startup && hours === hours_startup) { if (minutes < minutes_startup) return; }

            // build body
            const body = { 'sender': sender, 'text': text };

            // send to server
            const response = await request_POST(ENDPOINT_PROMPT, body);

            // log
            console.log(response);
        })

    }, REFRESH_MS);
});


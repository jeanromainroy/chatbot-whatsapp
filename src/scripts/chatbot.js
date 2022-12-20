'use strict';

// import config
import { ENDPOINT_PROMPT } from '../env.js';

// import libs
import { request_POST } from './helper.js';
import { return_locale_date_now_in_ISO_format } from '../libs/dt.js';
import { sleep } from '../libs/system.js';


export class ChatBot {

    constructor(tabId){
        this.tabId = tabId;
        this.post_ids_processed = new Set();
        this.date_startup = return_locale_date_now_in_ISO_format();
    }

    // helper function to send messages to injected scripts
    async sendMessage(messageType, data = null){
        return chrome.tabs.sendMessage(this.tabId, { type: messageType, data: data }, null);
    }


    // checks if post is valid and new
    was_post_published_after_startup(post){

        // destructure
        const { year, month, day, hours, minutes } = post;

        // check if message is older than app startup
        if (year < this.date_startup['year']) return false;
        if (year === this.date_startup['year']) { if (month < this.date_startup['month']) return false; }
        if (year === this.date_startup['year'] && month === this.date_startup['month']) { if (day < this.date_startup['day']) return false; }
        if (year === this.date_startup['year'] && month === this.date_startup['month'] && day === this.date_startup['day']) { if (hours < this.date_startup['hours']) return false; }
        if (year === this.date_startup['year'] && month === this.date_startup['month'] && day === this.date_startup['day'] && hours === this.date_startup['hours']) { if (minutes < this.date_startup['minutes']) return false; }

        return true;
    }


    has_post_already_been_processed(post){

        // destructure
        const { post_id } = post;

        // check if conversation already has this post
        return this.post_ids_processed.has(post_id);
    }


    async request_conversation(){

        // trigger scrape
        try {
            await this.sendMessage("startScrape");
        } catch (err) { 
            console.error(err);
            return null;
        }

        // sleep
        await sleep(300);

        // request conversation from injected script
        let response = null;
        try {
            response = await this.sendMessage('requestConversation');
        } catch (err) {
            console.error(err);
            return null;
        }

        // check
        if (response === undefined || response === null || !Array.isArray(response)) return null;

        // valid
        return response;
    }


    async run(){

        // request conversation
        const conversation = await this.request_conversation();

        // check
        if (conversation === null) return;

        // append
        for (const post of conversation){

            // destructure
            const { post_id, sender, text } = post;

            // check if post has already been processed
            if (this.has_post_already_been_processed(post)) continue;

            // add
            this.post_ids_processed.add(post_id);

            // check if post was published after app startup
            if(!this.was_post_published_after_startup(post)) continue;

            // build body
            const body = { 'sender': sender, 'text': text };

            // send to server
            const response = await request_POST(ENDPOINT_PROMPT, body);

            // check
            if (response === null) continue;

            // log
            try {
                await this.sendMessage("respondWith", response['message']);
            } catch (err) {
                console.error(err);
            }
        }
    }
}

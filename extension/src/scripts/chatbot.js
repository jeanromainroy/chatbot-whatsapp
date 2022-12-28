'use strict';

// import config
import { APP_NAME, ENDPOINT_PROMPT } from '../../../config.js';

// import libs
import { request_POST } from '../libs/http.js';
import { return_locale_date_now_in_ISO_format } from '../libs/dt.js';


export class ChatBot {

    constructor(tabId){
        
        // properties
        this.tabId = tabId;
        this.date_checkpoint = null;
        this.post_ids_processed = new Set();
        this.running = false;

        // init
        this.set_checkpoint_datetime();
    }


    // helper function to send messages to injected scripts
    async sendMessage(messageType, data = null){
        return chrome.tabs.sendMessage(this.tabId, { type: messageType, data: data }, null);
    }


    // sets the checkpoint datetime
    set_checkpoint_datetime() {
        this.date_checkpoint = return_locale_date_now_in_ISO_format();
    }


    // checks if post is valid and new
    was_post_published_after_checkpoint(post){

        // destructure
        const { year, month, day, hours, minutes } = post;

        // check if message is older than app checkpoint
        if (year < this.date_checkpoint['year']) return false;
        if (year === this.date_checkpoint['year']) { if (month < this.date_checkpoint['month']) return false; }
        if (year === this.date_checkpoint['year'] && month === this.date_checkpoint['month']) { if (day < this.date_checkpoint['day']) return false; }
        if (year === this.date_checkpoint['year'] && month === this.date_checkpoint['month'] && day === this.date_checkpoint['day']) { if (hours < this.date_checkpoint['hours']) return false; }
        if (year === this.date_checkpoint['year'] && month === this.date_checkpoint['month'] && day === this.date_checkpoint['day'] && hours === this.date_checkpoint['hours']) { if (minutes < this.date_checkpoint['minutes']) return false; }

        return true;
    }


    has_post_already_been_processed(post){

        // destructure
        const { post_id } = post;

        // check if conversation already has this post
        return this.post_ids_processed.has(post_id);
    }


    async request_most_recent_post(){

        // request conversation from injected script
        let response = null;
        try {
            response = await this.sendMessage('getMostRecentPost');
        } catch (err) {
            console.error(err);
            return null;
        }

        // check
        if (response === undefined || response === null || typeof(response) !== 'object' || 
            response['post_id'] === undefined || response['post_id'] === null) return null;

        // valid
        return response;
    }


    async run(){
        console.log(`${APP_NAME} - running`)

        // check flag
        if (this.running) return;

        // set flag
        this.running = true;

        // request most recent post
        const post = await this.request_most_recent_post();

        // check
        if (post === null) {
            this.running = false;
            return;
        }

        // destructure
        const { post_id, sender, text } = post;

        // check if post was published after app checkpoint
        if(!this.was_post_published_after_checkpoint(post)) {
            this.running = false;
            return;
        }

        // check if post has already been processed
        if (this.has_post_already_been_processed(post)) {
            this.running = false;
            return;
        }

        // add
        this.post_ids_processed.add(post_id);

        // build body
        const body = { 'sender': sender, 'text': text };

        // send to server
        const response = await request_POST(ENDPOINT_PROMPT, body);

        // check
        if (response === null) {
            this.running = false;
            return;
        }

        // log
        try {
            await this.sendMessage("postMessage", response['message']);
        } catch (err) {
            console.error(err);
        }

        // set flag
        this.running = false;
    }
}

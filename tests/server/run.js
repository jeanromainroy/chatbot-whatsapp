'use strict';

// -------------------------------------
// ---- MUST START THE SERVER FIRST ----
// -------------------------------------

// config
import { ENDPOINT_PROMPT, ENDPOINT_AUTHORIZED, SENDERS_AUTHORIZED } from '../../config.js';

// libs
import { request_POST } from '../../extension/src/libs/http.js';

// params
const operations = [ "VOC", "SUM", "REF", "EXP", "SYN", "ANT", "DEF" ];
const sentence = "What would you like to eat tonight?";


async function main() {

    // build body
    const body = { 'sender': SENDERS_AUTHORIZED[0], 'text': sentence };

    // send to server
    const response = await request_POST(ENDPOINT_AUTHORIZED, body);

    // check
    if (response === null) process.exit(0);

    // log
    console.log(response);
    
    // exit
    process.exit(0);
}

// run
main();

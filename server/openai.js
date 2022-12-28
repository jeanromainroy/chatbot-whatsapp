'use strict';

// config
import { OPENAI_API_KEY, max_tokens, temperature, endpoint } from '../config.js';


// helper function to clean text of html artefacts
function clean_text(text) {

    // remove all new line
    text = text.replaceAll("\n", " ");

    // remove whatsapp special styling characters
    text = text.replaceAll(/\*/g, '');
    text = text.replaceAll(/\_/g, '');
    text = text.replaceAll(/\`/g, '');

    // trim
    text = text.trim();

    return text;
}



export async function run(prompt){

    // run 
    const response = await fetch(endpoint, { 
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`
        }, 
        body: JSON.stringify({
            "prompt": prompt, 
            "temperature": temperature, 
            "max_tokens": max_tokens
        })
    });
    
    // extract response
    const data = await response.json();

    // parse
    let results = null;
    try {
        results = data.choices.map(d => d['text'].trim());
    } catch (err) {
        console.error(err);
        return null;
    }

    // extract first response
    let text = results[0];

    // check
    if (text === undefined || text === null || typeof(text) !== 'string') return null;

    // clean
    text = clean_text(text);

    return text;
}

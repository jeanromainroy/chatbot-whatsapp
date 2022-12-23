'use strict';

// config
import { OPENAI_API_KEY, max_tokens, temperature, endpoint } from '../config.js';


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

    return results[0];
}

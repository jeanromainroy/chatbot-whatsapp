"use strict"

// import
import { perform_regex, clean_html, clean_text } from '../libs/strings.js';

// regex
const regex_post_ids = new RegExp(`data-id="(.*?)"`, 'g');
const regex_post_by_id = (post_id) => { return new RegExp(`data-id="${post_id}".*?>.*?</div></div></div></div></div>`, 'g') };
const regex_post_text = new RegExp(`<span>(.*?)</span>`, 'g');
const regex_post_meta = new RegExp(`data-pre-plain-text="(.*?)"`, 'g');

const regexes_parse_post_meta = [
    {   // [hh:mm (am/pm), dd/mm/yyyy] Alice:
        "regex": /\[(.*?):(.*?) (.*?), (.*?)\/(.*?)\/(.*?)\] (.*?):/g,
        "sender": (parsed) => parsed[7],
        "year": (parsed) => +parsed[6],
        "month": (parsed) => +parsed[5],
        "day": (parsed) => +parsed[4],
        "hours": (parsed) => parsed[3] === 'pm' ? (+parsed[1])+12 : +parsed[1],
        "minutes": (parsed) => +parsed[2]
    },
    {   // [hh:mm, dd/mm/yyyy] Alice:
        "regex": /\[(.*?):(.*?), (.*?)\/(.*?)\/(.*?)\] (.*?):/g,
        "sender": (parsed) => parsed[6],
        "year": (parsed) => +parsed[5],
        "month": (parsed) => +parsed[4],
        "day": (parsed) => +parsed[3],
        "hours": (parsed) => +parsed[1],
        "minutes": (parsed) => +parsed[2]
    }    
]


function get_post_ids(html_str) {
    
    // run regex
    const matching_strings = perform_regex(html_str, regex_post_ids);

    // validate
    if (matching_strings.length === 0) return null;

    // grab first value
    let post_ids = matching_strings.map(d => d[1]);

    // remove duplicate
    post_ids = [...new Set(post_ids)];

    return post_ids;
}


function get_post_by_id(html_str, post_id) {

    // build regex for this input
    const regex = regex_post_by_id(post_id);

    // run regex
    const matching_strings = perform_regex(html_str, regex);

    // validate
    if (matching_strings.length === 0) return null;

    // grab first post that matched and select full match
    const post = matching_strings[0][0];

    // validate
    if (typeof(post) !== 'string') return null;

    return post;
}


function get_text(html_str_post) {
    
    // run regex
    const matching_strings = perform_regex(html_str_post, regex_post_text);
    
    // validate
    if (matching_strings.length === 0) return null;

    // grab first value
    let texts = matching_strings.map(d => d[1]);

    // clean
    texts = texts.map(text => clean_text(text));

    // join
    texts = texts.join(' ')

    // trim
    texts = texts.trim();

    return texts
}


function parse_meta(text){

    // iterate through locale
    for (const regex_parse_post_meta of regexes_parse_post_meta) {

        // match
        let parsed = text.matchAll(regex_parse_post_meta['regex']);

        // check
        if (parsed === undefined || parsed === null) continue;

        // try to apply
        try {

            // convert to arr
            parsed = [...parsed];
            
            // get first match
            parsed = [...parsed[0]];

            // check
            if (parsed === undefined || parsed === null || !Array.isArray(parsed)) continue;

            // destructure
            const sender = regex_parse_post_meta['sender'](parsed);
            const year = regex_parse_post_meta['year'](parsed);
            const month = regex_parse_post_meta['month'](parsed);
            const day = regex_parse_post_meta['day'](parsed);
            const hours = regex_parse_post_meta['hours'](parsed);
            const minutes = regex_parse_post_meta['minutes'](parsed);

            // return
            return {
                "year": year,
                "month": month,
                "day": day,
                "hours": hours,
                "minutes": minutes,
                "sender": sender
            }

        } catch(err) {}
    }

    return null;
}


function get_post_meta(html_str_post) {
    
    // run regex
    const matching_strings = perform_regex(html_str_post, regex_post_meta);

    // validate
    if (matching_strings.length === 0) return null;

    // grab first value
    const texts = matching_strings.map(d => d[1]);

    // check
    if (texts.length !== 1) return null;

    // clean
    let text = clean_text(texts[0]);

    // trim
    text = text.trim();

    // parse 
    const meta_parsed = parse_meta(text);

    return meta_parsed;
}


/**
 * Returns a list of dict with all the posts for a given html string
 *
 * Optional:
 *  already_extracted_post_ids : set of post ids we are not interested in
 */
export function extract_posts(html_str){

    // check type
    if (html_str === undefined || html_str === null || typeof(html_str) !== 'string') return [];

    // clean the html string
    const html_str_cleaned = clean_html(html_str);

    // extract post ids
    const post_ids = get_post_ids(html_str_cleaned);

    // check
    if (post_ids === undefined || post_ids === null || !Array.isArray(post_ids)) return [];

    // init
    let dataframe = [];

    // go through
    post_ids.forEach(post_id => {

        // init data object
        let datum = {};

        // get post
        const post = get_post_by_id(html_str_cleaned, post_id);

        // check
        if (post === undefined || post === null) return;

        // extract meta data
        const metadata = get_post_meta(post);

        // we require meta data
        if(metadata === undefined || metadata === null) return;

        // extract text
        const text = get_text(post);
        
        // set attributes
        datum['post_id'] = post_id;
        datum['text'] = text;
        Object.keys(metadata).forEach(key => { datum[key] = metadata[key]});

        // push to dataframe
        dataframe.push(datum);
    });

    return dataframe;
}

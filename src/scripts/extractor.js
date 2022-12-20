"use strict"

// import
import { perform_regex, clean_html, clean_text } from './helper.js';

// regex
const regex_post_ids = new RegExp(`data-id="(.*?)"`, 'g');
const regex_post_by_id = (post_id) => { return new RegExp(`data-id="${post_id}".*?>.*?</div></div></div></div></div>`, 'g') };
const regex_post_text = new RegExp(`<span>(.*?)</span>`, 'g');
const regex_post_meta = new RegExp(`data-pre-plain-text="(.*?)"`, 'g');
const regex_parse_post_meta = /\[(.*?):(.*?) (.*?), (.*?)\/(.*?)\/(.*?)\] (.*?):/g;


export class Extractor {

    constructor(){}


    get_post_ids(html_str) {
        
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


    get_post_by_id(html_str, post_id) {

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


    get_text(html_str_post) {
        
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


    get_post_meta(html_str_post) {
        
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
        const meta_parsed = [...[...text.matchAll(regex_parse_post_meta)][0]];

        // split
        const sender = meta_parsed[7];
        const year = +meta_parsed[6];
        const month = +meta_parsed[5];
        const day = +meta_parsed[4];
        const hours = meta_parsed[3] === 'pm' ? (+meta_parsed[1])+12 : +meta_parsed[1];
        const minutes = +meta_parsed[2];

        return {
            "year": year,
            "month": month,
            "day": day,
            "hours": hours,
            "minutes": minutes,
            "sender": sender
        }
    }


    /**
     * Returns a list of dict with all the posts for a given html string
     *
     * Optional:
     *  already_extracted_post_ids : set of post ids we are not interested in
     */
    async extract_posts(html_str, already_extracted_post_ids){

        // init
        let dataframe = [];

        // clean the html string
        const html_str_cleaned = clean_html(html_str);

        // extract post ids
        const post_ids = this.get_post_ids(html_str_cleaned);

        // check
        if (post_ids === undefined || post_ids === null || !Array.isArray(post_ids)) return {
            'posts': dataframe
        };

        // extract posts
        const posts = post_ids.map(post_id => this.get_post_by_id(html_str_cleaned, post_id)).filter(d => d !== undefined && d !== null);

        // go through
        for (const post of posts) {

            // init data object
            let datum = {};

            // extract post id
            const post_id = this.get_post_ids(post)[0];

            // we require post_id
            if(post_id === undefined || post_id === null) continue;

            // if post was already processed
            if(typeof already_extracted_post_ids === 'object' && already_extracted_post_ids.has(post_id)) continue;

            // extract meta data
            const metadata = this.get_post_meta(post);

            // we require meta data
            if(metadata === null) continue;

            // set attributes
            datum['post_id'] = post_id;
            datum['text'] = this.get_text(post);
            Object.keys(metadata).forEach(key => { datum[key] = metadata[key]});

            // push to dataframe
            dataframe.push(datum);
        }

        return {
            'posts': dataframe
        };
    }
}

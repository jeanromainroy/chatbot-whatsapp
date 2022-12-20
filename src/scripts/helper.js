'use strict';


// helper function to post image
export async function request_POST(url, body) {

    // params
    const opts = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    }

    // send request
    let response = null;
    try {
        response = await fetch(url, opts);
    } catch(err) {
        console.error(err);
        return null;
    }

    // data
    const data = await response.json();

    // return
    return data;
}


export async function request_GET(url) {

    // params
    const opts = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    }

    // send request
    const response = await fetch(url, opts);

    // data
    const data = await response.json();

    // return
    return data;
}


// helper function to perform a regex match
export function _perform_regex(html_str, regex) {
    const matches = html_str.matchAll(regex);
    if (matches === null) return [];
    return [...matches].map(d => {
        let values = [];
        for (let i=0 ; i<10 ; i++) {
            if (d[i] !== undefined && d[i] !== null && typeof(d[i]) === 'string') values.push(d[i]);
        }
        return values;
    });
}


// helper function to perform a or multiple regex match
export function perform_regex(html_str, regex) {
    if (Array.isArray(regex)) {
        let matching_strings = [];
        regex.forEach(_regex => _perform_regex(html_str, _regex).forEach(matching_string => matching_strings.push(matching_string)));
        return matching_strings
    } else {
        return _perform_regex(html_str, regex);
    }
}


// helper function to clean html string
export function clean_html(html_str){

    // remove all new line
    html_str = html_str.replaceAll("\n", "");

    // remove double whitespaces
    for(let i=0 ; i<5 ; i++){
        html_str = html_str.replaceAll("  ", " ");
    }

    // replace common stringifyed symbols
    html_str = html_str.replaceAll("&nbsp;", " ");
    html_str = html_str.replaceAll("&quot;", "'");

    return html_str;
}


// helper function to clean text of html artefacts
export function clean_text(text) {

    // replace
    text = text.replaceAll(/…/g, "");

    // remove the < >
    text = text.replaceAll(/<.*?>/g, " ")

    // remove double whitespaces
    for(let i=0 ; i<5 ; i++){
        text = text.replaceAll("  ", " ");
    }

    // remove the "
    text = text.replaceAll(/"/g, '')

    // trim
    text = text.trim();

    return text;
}

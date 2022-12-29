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

    // parse response
    let data = null;
    try {
        data = await response.json();
    } catch(err) {}

    // check status
    if (response.status !== 200) {
        console.error('Request failed:', data);
        return null;
    }

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


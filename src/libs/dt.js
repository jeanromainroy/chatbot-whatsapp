'use strict';

export function return_locale_date_now_in_ISO_format(){

    // generate a date for now
    const date_now = new Date();

    // convert to ISO format and local time (using the Sweden locale)
    const date_str = date_now.toLocaleString('sv');

    // parse using regex
    const date_elements = date_str.split(/[/\-: ]+/);

    // check length
    if (date_elements.length !== 6) return null;

    // destructure and convert to integer
    const [ year, month, day, hours, minutes, seconds ] = date_elements.map(d => +d);

    return { year, month, day, hours, minutes, seconds };
}

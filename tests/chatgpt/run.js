'use strict';

// import libs
import { run } from '../../server/chatgpt.js';


function parse_args(args){

    // check
    if (args.length !== 1) return;

    // parse
    const prompt = args[0];

    // check
    if (typeof(prompt) !== 'string' || prompt.length < 2) return null;

    return prompt;
}


async function main() {

    // extract cli args
    const args = process.argv.slice(2);

    // parse args
    const prompt = parse_args(args);

    // check
    if (prompt === null) return;

    // run
    const results = await run(prompt);

    // log
    console.log(results);

    // exit
    process.exit(0);
}

main();

'use strict';

// config
const API_PORT = 8080;

// libs
import express from 'express';
import { run as run_chatgpt } from './chatgpt.js';


// instantiate express server
const app = express();

// enable parse body
app.use(express.json({limit: '50mb'}));


app.post(
    '/seshat/prompt',
    async (req, res) => {

        // grab data from body
        const { sender, text } = req.body;

        // log
        console.log(`${sender}: ${text}`);

        // run
        // const response = await run_chatgpt(text);

        // // log
        // console.log(`Response: ${response}\n`);
        
        // // success
        // return res.status(200).send({ message: response })

        await new Promise(resolve => {
            setTimeout(() => { resolve() }, 3000);
        })

        // success
        return res.status(200).send({ message: 'Bnjour salut' })
    }
)

// start server
app.listen(API_PORT, () => {
    console.log(`\nSeshat hosted at http://localhost:${API_PORT}\n`);
});

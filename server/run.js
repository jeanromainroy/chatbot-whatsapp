'use strict';

// config
import { API_PORT, SENDERS_AUTHORIZED } from '../config.js';

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

        // check
        if (sender === undefined || text === undefined || sender === null || text === null || typeof(sender) !== 'string' || typeof(text) !== 'string') {
            return res.status(400).send({ message: 'invalid body' })
        }

        // log
        console.log(`${sender}: ${text}`);

        // check sender
        if (!SENDERS_AUTHORIZED.includes(sender)) {
            return res.status(401).send({ message: 'sender unauthorized' });
        }

        // await new Promise(resolve => {
        //     setTimeout(() => { resolve() }, 300);
        // })

        // // success
        // return res.status(200).send({ message: 'Bnjour salut' })

        // run
        const response = await run_chatgpt(text);

        // log
        console.log(`Response: ${response}\n\n`);

        // check
        if (response === undefined || response === null || typeof(response) !== 'string') {
            return res.status(401).send({ message: 'response invalid' });
        }
        
        // success
        return res.status(200).send({ message: response });
    }
)

// start server
app.listen(API_PORT, () => {
    console.log(`\nSeshat hosted at http://localhost:${API_PORT}\n`);
});

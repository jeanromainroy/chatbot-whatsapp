'use strict';

// config
import { API_PORT, SENDERS_AUTHORIZED } from '../config.js';

// libs
import express from 'express';
import { run as run_gpt } from './openai.js';


// instantiate express server
const app = express();

// enable parse body
app.use(express.json({limit: '10mb'}));

// checks if user is allowed to request
app.post(
    '/seshat/authorized',
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
        
        return res.status(200).send({ message: 'sender authorized' });
    }
)


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

        // run
        const response = await run_gpt(text);

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

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
        // run_chatgpt()

        // success
        return res.status(200).send({ message: 'image saved' })
    }
)

// start server
app.listen(API_PORT, () => {
    console.log(`\nSeshat hosted at http://localhost:${API_PORT}\n`);
});

# ChatBot Whatsapp

Served through a browser extension, this chatbot can be used to converse through WhatsApp.


## Mise-en-place

1. Allocate a server and connect to it using RDP

2. Install [Chrome](https://www.google.com/chrome/), [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) and [Node](https://nodejs.org/en/download/) 

3. Clone this repository

    git clone https://github.com/jeanromainroy/chatbot-whatsapp.git

4. Create a config file from the template [config.js.template](./config.js.template)

    cp config.js.template config.js

5. Install npm dependencies

    npm i

6. Build chrome extension

    npm run build

7. Open Chrome and type in the address bar

    chrome://extensions

8. Activate "Developer" mode

9. Click on "Load unpacked" and navigate to this [extension public](./extension/public/) directory

10. Restart browser

11. Navigate to [WhatsApp Web](https://web.whatsapp.com/)

12. Link your account with the browser 

13. Click on the conversation you want to connect the chatbot to

14. Leave the browser open on this page


## Conversational Agent 

We suggest using OpenAI's davinci model as conversational agent

1. Create a paid account with [OpenAI](https://beta.openai.com/)

2. Obtain an API key

3. Set it in your [config](./config.js) file

    export const OPENAI_API_KEY = '';


## Running

To launch the server that will be responding to incomming message. Simply open a terminal shell and run,

    npm run start

Type something in the conversation and look at the terminal to see if the server is functionning properly


## Whitelist

By default the chatbot will refuse to chat with unknown numbers. Set the authorized contact names in the [config file](./config.js).

    export const SENDERS_AUTHORIZED = ['Alice', 'Bob'];


## Dev

Whatsapp displays the message datetime differently depending on the locale. Make sure your locale is supported in the [extractor script](./extension/src/scripts/extractor.js)
        
    const regexes_parse_post_meta = [
        { // [hh:mm (am/pm), dd/mm/yyyy] Alice:
            "regex": /\[(.*?):(.*?) (.*?), (.*?)\/(.*?)\/(.*?)\] (.*?):/g,
            ...
        }
    ]

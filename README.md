# ChatBot Whatsapp

Served through a browser extension, this chatbot can be used to converse through WhatsApp.

## Mise-en-place

1. Allocate a server and connect to it using RDP

2. Install [Chrome](https://www.google.com/chrome/) and [Node](https://nodejs.org/en/download/) 

3. Clone this repository

4. Create a config file from the template [config.js.template](./server/config.js.template)

5. Set your openai secret key

    export const OPENAI_API_KEY = '';

6. Install npm dependencies

    npm i

7. Build chrome extension

    npm run build

8. Open Chrome and type in the address bar

    chrome://extensions

9. Click on "Load unpacked" and navigate to this [public](./public/) directory

10. Restart browser

11. Navigate to [WhatsApp Web](https://web.whatsapp.com/)

12. Link your account

13. Click on the conversation you want to connect the chatbot to

14. In a terminal launch the server

    npm run start

15. Type something in the conversation and look at the terminal to see if the server is functionning properly


## Whitelist

By default the chatbot will refuse to chat with unknown numbers. Set the authorized contact names in the [config file](./server/config.js).



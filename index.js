const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

const whapiToChatwoot = require('./api/whapiToChatwoot');
const chatwootToWhapi = require('./api/chatwootToWhapi');

app.get('/', (req, res) => {
    res.send(`Welcome to Asaf's Chatwoot <-> Whapi middleware. Enjoy!`);
});

app.use('/api/whapiToChatwoot', whapiToChatwoot);
app.use('/api/chatwootToWhapi', chatwootToWhapi);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

// hola bitches
// const express = require('express');
// const bodyParser = require('body-parser');
// const localtunnel = require('localtunnel');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 3001;

// app.use(bodyParser.json());

// const whapiToChatwoot = require('./api/whapiToChatwoot');
// const chatwootToWhapi = require('./api/chatwootToWhapi');

// // Setup API routes
// app.use('/api/whapiToChatwoot', whapiToChatwoot);
// app.use('/api/chatwootToWhapi', chatwootToWhapi);

// // Start the server
// app.listen(port, async () => {
//     console.log(`Server listening on port ${port}`);

//     // Start the localtunnel service
//     try {
//         const tunnel = await localtunnel({ port: port });
//         console.log(`LocalTunnel URL: ${tunnel.url}`);

//         tunnel.on('close', () => {
//             console.log('LocalTunnel closed');
//         });

//         tunnel.on('error', (err) => {
//             console.error('LocalTunnel error:', err);
//         });
//     } catch (error) {
//         console.error('Error starting LocalTunnel:', error);
//     }
// });


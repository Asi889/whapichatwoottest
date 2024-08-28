const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());

const whapiToChatwoot = require('./api/whapiToChatwoot');
const chatwootToWhapi = require('./api/chatwootToWhapi');

app.use('/api/whapiToChatwoot', whapiToChatwoot);
app.use('/api/chatwootToWhapi', chatwootToWhapi);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

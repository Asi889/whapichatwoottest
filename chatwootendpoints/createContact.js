// // create contact endpoint
const axios = require('axios');
const channels = require('../utils/channels');
const chatwootInboxID = process.env.CHATWOOT_INBOX_ID;


const createContact = async (contactName, contactNumber, contactInfo, channel_id) => {
    // console.log("mario");
    // console.log(contactName);
    // console.log(contactNumber);
    // console.log(channels[channel_id].chatwootInboxID);


    try {
        await axios.post(`https://app.chatwoot.com/public/api/v1/inboxes/${channels[channel_id].chatwootInboxID}/contacts`,
            {
                "name": `${contactName}`,
                "phone_number": `+${contactNumber}`
            },
            {
                headers: {
                    'api_access_token': `${process.env.CHATWOOT_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then((response) => {
            contactInfo.newContactID = response.data?.source_id;
        });
    } catch (error) {
        console.error('Error creating contact in Chatwoot:', error);
    }
};

module.exports = createContact;


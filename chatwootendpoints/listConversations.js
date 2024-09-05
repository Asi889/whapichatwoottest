// // list conversations endpoint
const axios = require('axios');
const channels = require('../utils/channels');
const chatwootInboxID = process.env.CHATWOOT_INBOX_ID;

const listConversations = async (contactInfo, channel_id) => {
    // console.log("444444444444444");
    // console.log(contactInfo);
    // console.log(channels[channel_id].chatwootInboxID);


    try {
        await axios.get(
            `https://app.chatwoot.com/public/api/v1/inboxes/${channels[channel_id].chatwootInboxID}/contacts/${contactInfo.currentContactID}/conversations`,
            {
                headers: {
                    'api_access_token': `${process.env.CHATWOOT_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                contactInfo.currentConversationID = response.data[0]?.id;
            })
    } catch (error) {
        console.error('Error listing conversations in Chatwoot:', error);
    }
};

module.exports = listConversations;

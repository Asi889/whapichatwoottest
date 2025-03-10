// //create conversation endpoint
const axios = require('axios');
const channels = require('../utils/channels');
const chatwootInboxID = process.env.CHATWOOT_INBOX_ID;

const createConversation = async (contactInfo, channel_id) => {
    try {
        await axios.post(
            `https://app.chatwoot.com/public/api/v1/inboxes/${channels[channel_id].chatwootInboxID}/contacts/${contactInfo.newContactID}/conversations`,
            {
                "custom_attributes": {}
            },
            {
                headers: {
                    'api_access_token': `${process.env.CHATWOOT_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then((response) => {
            contactInfo.conversationID = response?.data?.id;
        });
    } catch (error) {
        console.error('Error creating conversation in Chatwoot:', error);
    }
};

module.exports = createConversation;

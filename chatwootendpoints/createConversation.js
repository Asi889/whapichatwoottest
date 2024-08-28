// //create conversation endpoint
const axios = require('axios');
const chatwootInboxID = process.env.CHATWOOT_INBOX_ID;

const createConversation = async (contactInfo) => {
    try {
        await axios.post(
            `https://app.chatwoot.com/public/api/v1/inboxes/${chatwootInboxID}/contacts/${contactInfo.newContactID}/conversations`,
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

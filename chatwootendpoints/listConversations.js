// // list conversations endpoint
const axios = require('axios');
const chatwootInboxID = process.env.CHATWOOT_INBOX_ID;

const listConversations = async (contactInfo) => {
    try {
        await axios.get(
            `https://app.chatwoot.com/public/api/v1/inboxes/${chatwootInboxID}/contacts/${contactInfo.currentContactID}/conversations`,
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

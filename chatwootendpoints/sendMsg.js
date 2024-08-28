// // send msg endpoint
const axios = require('axios');
const chatwootInboxID = process.env.CHATWOOT_INBOX_ID;
const sendMsg = async (contactID, conversationID, finalMessage) => {
    try {
        await axios.post(
            `https://app.chatwoot.com/public/api/v1/inboxes/${chatwootInboxID}/contacts/${contactID}/conversations/${conversationID}/messages`,
            {
                "content": `${finalMessage}`,
                "echo_id": "string"
            },
            {
                headers: {
                    'api_access_token': `${process.env.CHATWOOT_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error) {
        console.error('Error sending message in Chatwoot:', error);
    }
};

module.exports = sendMsg;


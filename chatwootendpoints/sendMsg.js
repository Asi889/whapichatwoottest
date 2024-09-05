// // send msg endpoint
const axios = require('axios');
const channels = require('../utils/channels');
const chatwootInboxID = process.env.CHATWOOT_INBOX_ID;
const sendMsg = async (contactID, conversationID, finalMessage, inboxID) => {

    // let id = inboxID ? inboxID : null;
    // id = channels[inboxID]?.chatwootInboxID
    // if (id === null) {
    // }
    // console.log("inboxID66");
    // console.log(id);


    // return;
    try {
        const response = await axios.post(
            `https://app.chatwoot.com/public/api/v1/inboxes/${inboxID}/contacts/${contactID}/conversations/${conversationID}/messages`,
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
        // console.log("response");
        // console.log(response.data);
    } catch (error) {
        console.error('Error sending message in Chatwoot: joker', error);
    }
};

module.exports = sendMsg;


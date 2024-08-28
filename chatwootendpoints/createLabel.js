// createLabel end-point
const axios = require('axios');
const chatwootAccountID = process.env.CHATWOOT_ACCOUNT_ID;


const createLabel = async (chanel_id, conversationID, labels) => {

    let updatedLabels = [`${chanel_id}`];
    // let updatedLabels = [`${chanel_id}`, ...labels];

    try {
        await axios.post(`https://app.chatwoot.com/api/v1/accounts/${chatwootAccountID}/conversations/${conversationID}/labels`,
            {
                "labels": updatedLabels
            },
            {
                headers: {
                    'api_access_token': process.env.CHATWOOT_API_KEY,
                    'Content-Type': 'application/json'
                }
            }
        )
    } catch (error) {
        console.error('Error creating Label in chatwoot:', error);
    }
};

module.exports = createLabel;


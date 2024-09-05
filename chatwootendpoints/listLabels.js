// // list labels endpoint
const axios = require('axios');
const chatwootApiKey = process.env.CHATWOOT_API_KEY;
const chatwootAccountID = process.env.CHATWOOT_ACCOUNT_ID;


const listLabels = async (contactInfo) => {
    try {
        await axios.get(`https://app.chatwoot.com/api/v1/accounts/${chatwootAccountID}/conversations/${contactInfo.currentConversationID}/labels`,
            {
                headers: {
                    'api_access_token': `${chatwootApiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        ).then((response) => {
            contactInfo.labels = response.data?.payload;
        });
    } catch (error) {
        console.error('error getting labels list in chatwwots', error);
    }
};

module.exports = listLabels;


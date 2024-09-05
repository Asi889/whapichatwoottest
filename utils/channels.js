const channels = {

    "NIGHTW-5EM6A": {
        name: "channel_1",
        subName: "agam channel",
        apiKey: process.env.WHAPI_API_KEY_CHANNEL_1,
        chatwootInboxID: process.env.CHATWOOT_INBOX_ID_CHANNEL_1,
        // chatwootAccountID: process.env.CHATWOOT_ACCOUNT_ID_CHANNEL_1
    },

    "HULKBR-K5563": {
        name: "channel_2",
        subName: "democrats channel",
        apiKey: process.env.WHAPI_API_KEY_CHANNEL_2,
        chatwootInboxID: process.env.CHATWOOT_INBOX_ID_CHANNEL_2,
        // chatwootAccountID: process.env.CHATWOOT_ACCOUNT_ID_CHANNEL_2
    }
};

module.exports = channels;

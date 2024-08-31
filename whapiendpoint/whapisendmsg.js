// whapi send msg endpoint
const axios = require('axios');

const whapisendmsg = async (formatedNumber, chatwootMessage, channel_id, fileType, data_url) => {

    try {
        /// charck if i need to add a comma after view_once because im adding another object - ask chatgpt
        const whapiMessageData = {
            to: `${formatedNumber}`
        };

        if (fileType === 'image' || fileType === 'audio' || fileType === 'file') {
            whapiMessageData.media = data_url;
            whapiMessageData.caption = chatwootMessage.content || '';

        }

        if (fileType === 'text') whapiMessageData.body = chatwootMessage.content;
        if (fileType === 'file') fileType = "document";

        await axios.post(`https://panel.whapi.cloud/api/messages/${fileType}`, whapiMessageData, {
            headers: {
                'Authorization': `Bearer ${channel_id}`,
                'Content-Type': 'application/json'
            }
        });
        res.status(200).send('Post hapenned with success11');

        return
    } catch (error) {
        console.error('Error sending message to WhatsApp:', error);
    }
};

module.exports = whapisendmsg;


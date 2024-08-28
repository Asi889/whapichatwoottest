// getMedia
// whapi send msg endpoint
const axios = require('axios');
const channels = require('../utils/channels');

const getMedia = async (imgId, channel_id, contactInfo) => {
    try {

        await axios.get(`https://gate.whapi.cloud/media/${imgId}`, {
            responseType: 'arraybuffer',
            headers: {
                'Authorization': `Bearer ${channels[channel_id].apiKey}`,
            }
        }).then((response) => {
            contactInfo.file = response.data;
        })


    } catch (error) {
        console.error('Error getting media:', error);
    }


};

module.exports = getMedia;


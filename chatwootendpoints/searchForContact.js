// // searching for contact endpoint
const axios = require('axios');

const searchForContact = async (contactNumber, contactInfo) => {
    try {
        await axios.get(`https://app.chatwoot.com/api/v1/accounts/101557/contacts/search?q=${contactNumber}`, {
            headers: {
                'api_access_token': `${process.env.CHATWOOT_API_KEY}`,
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            contactInfo.contactMetaCount = response?.data?.meta?.count;
            contactInfo.currentContactID = response?.data?.payload[0]?.contact_inboxes[0]?.source_id;
        });
    } catch (error) {
        console.error('Error searching for contact in Chatwoot:', error);
    }
}

module.exports = searchForContact;

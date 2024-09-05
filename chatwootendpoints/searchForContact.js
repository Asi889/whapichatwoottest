// // searching for contact endpoint
const axios = require('axios');
const channels = require('../utils/channels');
const chatwootAccountID = process.env.CHATWOOT_ACCOUNT_ID;

const getSubNameByChannelId = (channel_id) => {
    // console.log("shalom yall");

    return channels[channel_id]?.subName || null;
};

const getKeyBySubName = (subName) => {
    for (let key in channels) {
        if (channels[key].subName === subName) {
            return key;
        }
    }
    return null;
};

const searchForContact = async (contactNumber, contactInfo, channel_id) => {

    try {
        const response = await axios.get(`https://app.chatwoot.com/api/v1/accounts/${chatwootAccountID}/contacts/search?q=${contactNumber}`, {
            headers: {
                'api_access_token': `${process.env.CHATWOOT_API_KEY}`,
                'Content-Type': 'application/json'
            }
        })


        //first timer ever(not a contact yet)
        if (response?.data?.payload?.length === 0) {
            console.log("first timer");
            contactInfo.contactFirstTimer = true;
            contactInfo.inboxIDForExistingContact = channel_id
            return;
        };


        //existing but only in one channel( only in one conversation)
        if (response?.data.payload[0]?.contact_inboxes?.length === 1) {
            console.log("existing but only in one channel");
            //checking the channel id from whapi (channels[channel_id].subName)  if it is not the same as the name in the search response
            if (channels[channel_id].subName !== response?.data.payload[0].contact_inboxes[0]?.inbox.name) {
                console.log("different channel");

                //if not then we need to create a new contact, label, conversation and then send msg we shuld flag it.
                // contactInfo.existingButnewChannel = true;
                contactInfo.contactFirstTimer = true;
                contactInfo.inboxIDForExistingContact = channel_id
                return;
            }
            console.log("same channel");
            contactInfo.contactExistsInOne = true;
            contactInfo.currentContactID = response?.data.payload[0].contact_inboxes[0]?.source_id;
            contactInfo.inboxIDForExistingContact = channel_id
            return;
        };


        //contact exists in more then oen channel/conversatiopn
        if (response?.data?.payload[0]?.contact_inboxes?.length > 1) {
            console.log("existing in more then one conversation/channel");
            contactInfo.contactExistsInMany = true;
            const subName = getSubNameByChannelId(channel_id);
            const matchingInboxIndex = response?.data.payload[0].contact_inboxes.findIndex(inbox => inbox.inbox.name === subName);
            contactInfo.currentContactID = response?.data?.payload[0]?.contact_inboxes[matchingInboxIndex].source_id;
            contactInfo.inboxIDForExistingContact = getKeyBySubName(response?.data?.payload[0]?.contact_inboxes[matchingInboxIndex].inbox.name)

            //checking if i need this: getKeyBySubName(response?.data?.payload[0]?.contact_inboxes[matchingInboxIndex].inbox.name)
            // or channel_id is good enough
            console.log("checking");
            console.log(contactInfo.inboxIDForExistingContact);
            console.log(channel_id);

            return;
        };


    } catch (error) {
        console.error('Error searching for contact in Chatwoot:', error);
    }
}

module.exports = searchForContact;

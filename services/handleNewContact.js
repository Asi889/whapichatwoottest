// services/handleNewContact.js
const createContact = require('../chatwootendpoints/createContact');
const createConversation = require('../chatwootendpoints/createConversation');
const createLabel = require('../chatwootendpoints/createLabel');
const sendWithAttachment = require('../chatwootendpoints/sendWithAttachment');
const sendMsg = require('../chatwootendpoints/sendMsg');
const channels = require('../utils/channels');

const getKeyByApiKey = (apiKey) => {
    for (let key in channels) {
        if (channels[key].apiKey === apiKey) {
            return key; // Return the key when apiKey matches
        }
    }
    return null; // Return null if no matching apiKey is found
};
const getSubNameByChannelId = (channel_id) => {
    // console.log("shalom yall");

    return channels[channel_id]?.subName || null; // Returns the subName if it exists, otherwise null
};

const handleNewContact = async (contactName, contactNumber, channel_id, contactInfo, finalMessage, attachmentFlag, attachmentType) => {
    // console.log(`inside handleNewContact`);

    await createContact(contactName, contactNumber, contactInfo, channel_id);

    await createConversation(contactInfo, channel_id);
    await createLabel(channels[channel_id].name, contactInfo.conversationID, contactInfo.labels);

    if (attachmentFlag) {
        await sendWithAttachment(contactInfo.file, contactInfo.newContactID, contactInfo.conversationID, attachmentType, channel_id);
        return { status: 200, message: 'whapitToChatwoot with attachment happened with success' };
    }
    // console.log("loki111");
    // console.log(contactInfo);
    // let gg = getKeyByApiKey(contactInfo.inboxIDForExistingContact)
    let gg = channels[channel_id].chatwootInboxID;
    console.log("gg");
    console.log(gg);

    await sendMsg(contactInfo.newContactID, contactInfo.conversationID, finalMessage, gg);
    // console.log("loki222");


    return { status: 200, message: 'whapitToChatwoot happened with success' };
};

module.exports = handleNewContact;

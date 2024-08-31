// services/handleNewContact.js
const createContact = require('../chatwootendpoints/createContact');
const createConversation = require('../chatwootendpoints/createConversation');
const createLabel = require('../chatwootendpoints/createLabel');
const sendWithAttachment = require('../chatwootendpoints/sendWithAttachment');
const sendMsg = require('../chatwootendpoints/sendMsg');
const channels = require('../utils/channels');

const handleNewContact = async (contactName, contactNumber, channel_id, contactInfo, finalMessage, attachmentFlag, attachmentType) => {
    await createContact(contactName, contactNumber, contactInfo);
    await createConversation(contactInfo);
    await createLabel(channels[channel_id].name, contactInfo.conversationID, contactInfo.labels);

    if (attachmentFlag) {
        await sendWithAttachment(contactInfo.file, contactInfo.newContactID, contactInfo.conversationID, attachmentType);
    } else {
        await sendMsg(contactInfo.newContactID, contactInfo.conversationID, finalMessage);
    }

    return { status: 200, message: 'whapitToChatwoot happened with success' };
};

module.exports = handleNewContact;

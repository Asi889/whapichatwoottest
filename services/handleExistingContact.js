// services/handleExistingContact.js
const listConversations = require('../chatwootendpoints/listConversations');
const listLabels = require('../chatwootendpoints/listLabels');
const createLabel = require('../chatwootendpoints/createLabel');
const sendWithAttachment = require('../chatwootendpoints/sendWithAttachment');
const sendMsg = require('../chatwootendpoints/sendMsg');
const channels = require('../utils/channels');

const handleExistingContact = async (channel_id, contactInfo, finalMessage, attachmentFlag, attachmentType) => {

    await listConversations(contactInfo, channel_id);
    await listLabels(contactInfo);

    if (!contactInfo.labels.includes(channels[channel_id].name)) {
        await createLabel(channels[channel_id].name, contactInfo.currentConversationID, contactInfo.labels);
    }

    if (attachmentFlag) {
        await sendWithAttachment(contactInfo.file, contactInfo.currentContactID, contactInfo.currentConversationID, attachmentType);
    }


    await sendMsg(contactInfo.currentContactID, contactInfo.currentConversationID, finalMessage, channels[channel_id].chatwootInboxID);


    return { status: 200, message: 'whapitToChatwoot happened with success' };
};

module.exports = handleExistingContact;

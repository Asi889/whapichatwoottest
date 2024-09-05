const express = require('express');
const handleNewContact = require('../services/handleNewContact');
const handleExistingContact = require('../services/handleExistingContact');
const searchForContact = require('../chatwootendpoints/searchForContact');
const validateMessage = require('../services/validateMessage');
const router = express.Router();

router.post('/', async (req, res) => {
    console.log("inside and starting whapiToChatwoot route");

    let finalMessage = "";
    let contactName = "";
    let contactNumber = "";
    let chat_id = "";
    let channel_id = "";
    let attachmentFlag = false;
    let attachmentType = "";

    let contactInfo = {
        currentContactID: "",
        conversationID: "",
        currentConversationID: "",
        newContactID: "",
        labels: [],
        file: "",
        inboxIDForExistingContact: "",
        contactFirstTimer: false,
        contactExistsInOne: false,
        contactExistsInMany: false,
        // existingButnewChannel: false
    };

    // Validate the incoming message
    const validation = validateMessage(req);

    if (!validation.valid) {

        return res.status(validation.statusCode || 200).send(validation.message);
    }

    // getting the message and contact information
    const whatsappMessage = validation.whatsappMessage;


    if (whatsappMessage) {
        finalMessage = whatsappMessage?.text?.body;
        contactNumber = whatsappMessage?.from;
        contactName = whatsappMessage?.from_name;
        chat_id = whatsappMessage?.chat_id;
        channel_id = req?.body?.channel_id;
    }

    if (validation?.statusCode === 204) {
        // console.log("status code 204");

        finalMessage = validation.message;
    }

    if (whatsappMessage?.voice || whatsappMessage?.audio || whatsappMessage?.image) {
        attachmentFlag = true;
        contactInfo.file = whatsappMessage?.voice?.link || whatsappMessage?.audio?.link || whatsappMessage?.image?.link;
        attachmentType = whatsappMessage?.voice ? 'voice' : whatsappMessage?.audio ? 'audio' : 'image';
    }

    if (whatsappMessage?.action?.type === 'reaction') {
        finalMessage = `${contactName} just reacted with a ${req.body.messages[0].action.emoji}`;
    }


    if (whatsappMessage?.link_preview) {
        finalMessage = whatsappMessage?.link_preview?.url;
    }

    try {

        await searchForContact(contactNumber, contactInfo, channel_id);

        //first timer ever(not a contact yet)
        if (contactInfo?.contactFirstTimer) {
            console.log("inside first timer ");
            const newContactResult = await handleNewContact(contactName, contactNumber, channel_id, contactInfo, finalMessage, attachmentFlag, attachmentType);
            res.status(newContactResult.status).send(newContactResult.message);
            return
        };

        //existing but only in one channel( only in one conversation)
        if (contactInfo.contactExistsInOne) {
            console.log("inside existing but only in one channel");
            const existingContactResult = await handleExistingContact(channel_id, contactInfo, finalMessage, attachmentFlag, attachmentType);
            res.status(existingContactResult.status).send(existingContactResult.message);
            return
        };

        //contact exists in more then oen channel/conversatiopn
        if (contactInfo.contactExistsInMany) {
            console.log("inside contact exists in more then oen channel/conversatiopn");
            const existingContactResult = await handleExistingContact(contactInfo.inboxIDForExistingContact, contactInfo, finalMessage, attachmentFlag, attachmentType);
            res.status(existingContactResult.status).send(existingContactResult.message);

        };


    } catch (error) {
        console.error("Error in whapiToChatwoot route:", error);
        return res.status(500).send('An error occurred');
    }

    console.log("finished whapiToChatwoot route");
});

module.exports = router;
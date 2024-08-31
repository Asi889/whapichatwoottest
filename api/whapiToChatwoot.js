// // whapitToChatwoot
// const express = require('express');
// const createContact = require('../chatwootendpoints/createContact');
// const createConversation = require('../chatwootendpoints/createConversation');
// const listConversations = require('../chatwootendpoints/listConversations');
// const searchForContact = require('../chatwootendpoints/searchForContact');
// const sendMsg = require('../chatwootendpoints/sendMsg');
// const listLabels = require('../chatwootendpoints/listLabels');
// const createLabel = require('../chatwootendpoints/createLabel');
// const sendWithAttachment = require('../chatwootendpoints/sendWithAttachment');
// const channels = require('../utils/channels');
// const router = express.Router();
// //change

// router.post('/', async (req, res) => {
//     console.log("inside and starting whapiToChatwoo route");

//     let finalMessage = "";
//     let contactName = "";
//     let contactNumber = "";
//     let chat_id = "";
//     let channel_id = "";
//     let attachmentFlag = false
//     let attachmentType = "";


//     let contactInfo = {
//         contactMetaCount: "",
//         currentContactID: "",
//         conversationID: "",
//         currentConversationID: "",
//         newContactID: "",
//         labels: [],
//         file: ""
//     };

//     if (!req.body?.messages) {
//         console.log("no body");
//         res.status(201).send('no body');
//         return;
//     }

//     if (req.body.messages[0].from === '972554335933' || req.body.messages[0].from === '972535757173') {
//         console.log("beeing sent from whapi phones");
//         res.status(201).send('beeing sent from whapi phones');
//         return
//     }




//     if (req.body.messages[0].source !== 'mobile' && req.body.messages[0].source !== 'web') {
//         console.log("source is not mobile or web");
//         res.status(201).send('source is not mobile or web');
//         return;
//     }

//     const whatsappMessage = req?.body?.messages[0] || "";

//     if (whatsappMessage) {
//         finalMessage = whatsappMessage?.text?.body;
//         contactNumber = whatsappMessage?.from;
//         contactName = whatsappMessage?.from_name;
//         chat_id = whatsappMessage?.chat_id;
//         channel_id = req?.body?.channel_id;
//     };

//     let chatIdChaeck = chat_id.includes('@g.us');

//     if (chatIdChaeck) {
//         console.log("message from a chat group.");
//         res.status(201).send('message from a chat group');
//         return;
//     }

//     if (!whatsappMessage) {
//         console.log('no message ID', req.body);
//         res.status(201).send('no message ID');
//         return;
//     }

//     if (whatsappMessage?.action?.type === 'reaction') {
//         finalMessage = `${contactName} just reacted with a ${req.body.messages[0].action.emoji}`;
//     }

//     if (
//         whatsappMessage?.contact ||
//         whatsappMessage?.location ||
//         whatsappMessage?.live_location ||
//         whatsappMessage?.poll ||
//         whatsappMessage?.contact_list ||
//         whatsappMessage?.document ||
//         whatsappMessage?.sticker
//     ) {
//         console.log("Message contains contact, image, document, or location. Stopping further processing.");
//         finalMessage = "contact tried to send a attachment.";
//     }

//     if (whatsappMessage?.voice || whatsappMessage?.audio || whatsappMessage?.image) {
//         attachmentFlag = true;
//         contactInfo.file = whatsappMessage?.voice?.link || whatsappMessage?.audio?.link || whatsappMessage?.image?.link;
//         attachmentType = whatsappMessage?.voice ? 'voice' : whatsappMessage?.audio ? 'audio' : 'image';
//     }

//     // if the message is a link, then lets use the link_preview url as the text message.
//     if (whatsappMessage.link_preview) {
//         finalMessage = whatsappMessage?.link_preview?.url
//     }

//     try {
//         //first check if contact exists by the phone number
//         await searchForContact(contactNumber, contactInfo);

//         // if contact doesnt exist then create a new contact and conversation and label and send regular text or with attachment
//         if (contactInfo.contactMetaCount === 0 || contactInfo.contactMetaCount === null || contactInfo.contactMetaCount === "") {

//             await createContact(contactName, contactNumber, contactInfo);

//             await createConversation(contactInfo);

//             await createLabel(channels[channel_id].name, contactInfo.conversationID, contactInfo.labels);

//             if (attachmentFlag) {
//                 await sendWithAttachment(contactInfo.file, contactInfo.newContactID, contactInfo.conversationID, attachmentType);
//                 return;
//             }

//             await sendMsg(contactInfo.newContactID, contactInfo.conversationID, finalMessage);
//             res.status(200).send('whapitToChatwoot hapenned with success');

//             return;
//         }

//         // if contact does exist then just list conversations and labels (add new labels if there are) and send regular text or with attachment
//         await listConversations(contactInfo);

//         await listLabels(contactInfo);

//         if (!contactInfo.labels.includes(channels[channel_id].name)) {

//             await createLabel(channels[channel_id].name, contactInfo.currentConversationID, contactInfo.labels);
//         };


//         if (attachmentFlag) {
//             await sendWithAttachment(contactInfo.file, contactInfo.currentContactID, contactInfo.currentConversationID, attachmentType);
//             return;
//         }

//         await sendMsg(contactInfo.currentContactID, contactInfo.currentConversationID, finalMessage);
//         res.status(200).send('whapitToChatwoot hapenned with success');


//     } catch (error) {
//         console.error("Error in whapiToChatwoot route:", error);
//         return res.status(500).send('An error occurred');
//     }

//     console.log("finished whapiToChatwoo route");
//     return;
// });

// module.exports = router;
// api/whapiToChatwoot.js
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
        contactMetaCount: "",
        currentContactID: "",
        conversationID: "",
        currentConversationID: "",
        newContactID: "",
        labels: [],
        file: ""
    };

    // Validate the incoming message
    const validation = validateMessage(req);

    if (!validation.valid) {
        console.log(validation.message);
        return res.status(validation.statusCode || 200).send(validation.message);
    }

    // Assign values from the validated message
    const whatsappMessage = validation.whatsappMessage;

    if (whatsappMessage) {
        finalMessage = whatsappMessage?.text?.body;
        contactNumber = whatsappMessage?.from;
        contactName = whatsappMessage?.from_name;
        chat_id = whatsappMessage?.chat_id;
        channel_id = req?.body?.channel_id;
    }

    if (whatsappMessage?.voice || whatsappMessage?.audio || whatsappMessage?.image) {
        attachmentFlag = true;
        contactInfo.file = whatsappMessage?.voice?.link || whatsappMessage?.audio?.link || whatsappMessage?.image?.link;
        attachmentType = whatsappMessage?.voice ? 'voice' : whatsappMessage?.audio ? 'audio' : 'image';
    }

    if (whatsappMessage.link_preview) {
        finalMessage = whatsappMessage?.link_preview?.url;
    }

    try {
        await searchForContact(contactNumber, contactInfo);

        if (contactInfo.contactMetaCount === 0 || contactInfo.contactMetaCount === null || contactInfo.contactMetaCount === "") {
            const newContactResult = await handleNewContact(contactName, contactNumber, channel_id, contactInfo, finalMessage, attachmentFlag, attachmentType);
            res.status(newContactResult.status).send(newContactResult.message);
        } else {
            const existingContactResult = await handleExistingContact(channel_id, contactInfo, finalMessage, attachmentFlag, attachmentType);
            res.status(existingContactResult.status).send(existingContactResult.message);
        }
    } catch (error) {
        console.error("Error in whapiToChatwoot route:", error);
        return res.status(500).send('An error occurred');
    }

    console.log("finished whapiToChatwoot route");
});

module.exports = router;


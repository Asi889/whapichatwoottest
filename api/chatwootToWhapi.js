
// //chatwootToWhapi
const express = require('express');
const whapisendmsg = require('../whapiendpoint/whapisendmsg');
const channels = require('../utils/channels');
const getChannelInfoByLabel = require('../utils/getChannelInfoByLabel');
const formatPhoneNumber = require('../utils/formatPhoneNumber');
const router = express.Router();

// router.post('/', async (req, res) => {
//     console.log("inside and starting chatwootToWhapi route");

//     let labels = "";
//     let attachmentFlag = false
//     const chatwootMessage = req.body;

//     if (!chatwootMessage) {
//         console.log("no chatwoot message");
//         return;
//     }
//     if (chatwootMessage.attachments && chatwootMessage.attachments.length > 0) {
//         attachmentFlag = true;
//     }

//     if (chatwootMessage.message_type === 'incoming') {
//         console.log("incoming message");
//         return;
//     };

//     if (!chatwootMessage.conversation) {
//         console.log("no chatwoot message");
//         return;
//     };

//     if (chatwootMessage.conversation.labels) {
//         labels = chatwootMessage?.conversation?.labels[0];
//     };

//     const recipientPhoneNumber = chatwootMessage.conversation.meta.sender.phone_number;

//     const formatedNumber = formatPhoneNumber(recipientPhoneNumber);

//     let convertedChannelName = getChannelInfoByLabel(labels);

//     try {
//         if (attachmentFlag) {

//             for (let attachment of chatwootMessage.attachments) {
//                 let file_type = attachment.file_type;
//                 let data_url = attachment.data_url;
//                 await whapisendmsg(formatedNumber, chatwootMessage, convertedChannelName.apiKey, file_type, data_url);
//             }
//             console.log("finished loop de loop");

//             return;
//         }

//         await whapisendmsg(formatedNumber, chatwootMessage, convertedChannelName.apiKey, "text", "");

//     } catch (error) {
//         console.error('Error sending message to WhatsApp:', error);
//         res.status(500).send('Error processing Chatwoot message');
//     }
//     console.log("finished chatwootToWhapi route");

//     return;
// });
router.post('/', async (req, res) => {
    console.log("inside and starting chatwootToWhapi route");

    let labels = "";
    let attachmentFlag = false;
    const chatwootMessage = req.body;

    if (!chatwootMessage) {
        console.log("no chatwoot message");
        return res.status(400).send('No chatwoot message provided');
    }

    // Respond immediately
    res.status(200).send('Processing started');

    // Background processing
    (async () => {
        try {
            if (chatwootMessage.attachments && chatwootMessage.attachments.length > 0) {
                attachmentFlag = true;
            }

            if (chatwootMessage.message_type === 'incoming') {
                console.log("incoming message");
                return;
            }

            if (!chatwootMessage.conversation) {
                console.log("no chatwoot message");
                return;
            }

            if (chatwootMessage.conversation.labels) {
                labels = chatwootMessage.conversation.labels[0];
            }

            const recipientPhoneNumber = chatwootMessage.conversation.meta.sender.phone_number;
            const formatedNumber = formatPhoneNumber(recipientPhoneNumber);
            let convertedChannelName = getChannelInfoByLabel(labels);

            if (attachmentFlag) {
                for (let attachment of chatwootMessage.attachments) {
                    let file_type = attachment.file_type;
                    let data_url = attachment.data_url;
                    await whapisendmsg(formatedNumber, chatwootMessage, convertedChannelName.apiKey, file_type, data_url);
                }
                console.log("finished loop de loop");
                return;
            }

            await whapisendmsg(formatedNumber, chatwootMessage, convertedChannelName.apiKey, "text", "");

        } catch (error) {
            console.error('Error sending message to WhatsApp:', error);
        }

        console.log("finished chatwootToWhapi route");
    })();
});


module.exports = router;


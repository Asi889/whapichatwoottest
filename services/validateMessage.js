// services/validateMessage.js

const systemNumbers = require("../utils/systemNumbers");

const validateMessage = (req) => {
    const whatsappMessage = req?.body?.messages[0] || "";
    const chat_id = whatsappMessage?.chat_id || "";

    if (!req.body?.messages) {
        return { valid: false, message: "no body", statusCode: 201 };
    }

    if (systemNumbers.includes(whatsappMessage?.from)) {
        return { valid: false, message: "being sent from whapi phones", statusCode: 201 };
    }

    if (whatsappMessage?.source !== 'mobile' && whatsappMessage?.source !== 'web') {
        return { valid: false, message: "source is not mobile or web", statusCode: 201 };
    }

    if (chat_id.includes('@g.us')) {
        return { valid: false, message: "message from a chat group", statusCode: 201 };
    }

    if (!whatsappMessage) {
        return { valid: false, message: "no message ID", statusCode: 201 };
    }

    if (whatsappMessage?.contact || whatsappMessage?.location || whatsappMessage?.live_location || whatsappMessage?.poll || whatsappMessage?.contact_list || whatsappMessage?.document || whatsappMessage?.sticker) {
        console.log("contact tried to send an attachment");

        return { valid: true, message: "contact tried to send an attachment", whatsappMessage, statusCode: 204 };
    }


    return { valid: true, message: "valid", whatsappMessage, statusCode: 203 };
};

module.exports = validateMessage;

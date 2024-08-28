const axios = require('axios');
const FormData = require('form-data');
const chatwootInboxID = process.env.CHATWOOT_INBOX_ID;

async function sendWithAttachment(fileUrl, contactId, conversationId, attachmentType) {
    // Map attachment types to appropriate file extensions and content types
    const fileExtensionMap = {
        image: 'png',
        document: 'pdf',
        voice: 'mp3',
        audio: 'mp3'
    };

    const contentTypeMap = {
        image: 'image/png',
        document: 'application/pdf',
        voice: 'audio/mpeg',
        audio: 'audio/mpeg'
    };

    const fileExtension = fileExtensionMap[attachmentType] || 'bin';
    const contentType = contentTypeMap[attachmentType] || 'application/octet-stream';


    try {
        // Download the file from the URL
        const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });

        const fileBuffer = Buffer.from(response.data, 'binary');

        const formData = new FormData();
        formData.append('attachments[]', fileBuffer, {
            filename: `attachment.${fileExtension}`,
            contentType: contentType,
        });

        // Send the file to Chatwoot
        await axios.post(
            `https://app.chatwoot.com/public/api/v1/inboxes/${chatwootInboxID}/contacts/${contactId}/conversations/${conversationId}/messages`,
            formData,
            {
                headers: {
                    'api_access_token': process.env.CHATWOOT_API_KEY,
                    ...formData.getHeaders()
                }
            }
        );
    } catch (error) {
        console.error("Error sending message with attachment:", error);
    }
}

module.exports = sendWithAttachment;
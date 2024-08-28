const channels = require("./channels");

function getChannelInfoByLabel(label) {
    return Object.values(channels).find(channel => channel.name === label);
}

module.exports = getChannelInfoByLabel;
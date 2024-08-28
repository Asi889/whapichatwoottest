function formatPhoneNumber(phoneNumber) {

    if (phoneNumber.startsWith('+')) {

        return phoneNumber.substring(1);
    } else {

        return phoneNumber;
    }
};

module.exports = formatPhoneNumber;
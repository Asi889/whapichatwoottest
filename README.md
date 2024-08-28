# Chatwoot & Whapi Integration Service

This Node.js application provides a service that connects Chatwoot and Whapi to allow seamless communication between the two platforms. The service enables sending and receiving messages between Chatwoot and WhatsApp via the Whapi API and the CHatwoot API channel using each providers webhooks.

## Features
- Search for contacts in Chatwoot and create them if they don't exist.
- Create conversations in Chatwoot for incoming WhatsApp messages.
- Send messages from Chatwoot to WhatsApp using Whapi.
- Error handling with appropriate HTTP status codes.

## Prerequisites
- Node.js
- A Chatwoot account with API access.
- A Whapi account with API access.
- LocalTunnel (optional for development testing).
- Vercel account (for deployment)


## Installation

1. Clone the repository:

git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name

2. install dependencies:

- npm install

3. Create a `.env` file in the root directory and add the following environment variables:

CHATWOOT_API_KEY=**********************
CHATWOOT_INBOX_ID==**********************
WHAPI_API_KEY==**********************

4. Start the application:
- node index.js

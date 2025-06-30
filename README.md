# Kai - My Site dot AI Voice Onboarding Assistant

A voice-powered onboarding assistant that collects website information from new users through natural conversation. Built with Deepgram's Voice Agent API, Kai helps personalize the My Site dot AI experience by gathering essential business and website details.

## What is Kai?

Kai is a friendly, patient, and efficient voice assistant designed to help new users get started with My Site dot AI. Through natural conversation, Kai collects information about:

- Business description and brand name
- Website goals and visitor actions
- Design preferences and style
- Additional services needed
- Contact information for WhatsApp delivery

## Features

- **Natural Voice Conversation**: Uses Deepgram's advanced speech-to-speech capabilities
- **Data Collection**: Automatically extracts and stores website information
- **Personalized Experience**: Tailors the onboarding process to each user's needs
- **WhatsApp Integration**: Sends completed websites directly to users' phones
- **Patient & Understanding**: Designed for users of all technical skill levels

## Prerequisites

Before you begin, ensure you have:
- Node.js 18 or higher installed
- npm (comes with Node.js)
- A Deepgram API key (see below)

## Quickstart

Follow these steps to get started with Kai.

### Clone the repository

Go to GitHub and [clone the repository](https://github.com/deepgram-starters/node-voice-agent).

### Install dependencies

Install the project dependencies:

```bash
npm install
```

### Create a `.env` config file

Copy the code from `sample.env` and create a new file called `.env`. Paste in the code and enter your API key you generated in the [Deepgram Console](https://console.deepgram.com/).

```
DEEPGRAM_API_KEY=your_deepgram_api_key_here
```

### Run the application

Start the server with:

```bash
npm start
```

Then open your browser and go to:

```
http://localhost:3000
```

- Allow microphone access when prompted.
- Speak with Kai to begin your onboarding session.
- Kai will guide you through collecting your website information.
- Your data will be saved and used to personalize your My Site dot AI experience.

## Data Collection

Kai automatically collects and stores the following information:

- **Business Description**: What your business does
- **Brand Name**: Your business or brand name
- **Website Goal**: Main purpose of your website
- **Visitor Action**: What you want visitors to do
- **Design Style**: Preferred visual style (modern, professional, playful, etc.)
- **Additional Services**: Any extra help needed (ads, content, social media)
- **Phone Number**: For WhatsApp delivery of your website

All data is stored locally in the `data/` directory as JSON files for processing.

## Onboarding Flow

1. **Welcome**: Kai introduces herself and explains the process
2. **Information Gathering**: Natural conversation to collect website details
3. **Data Processing**: Information is extracted and stored
4. **Website Generation**: Data is used to create personalized websites
5. **WhatsApp Delivery**: Completed websites are sent to users' phones

## Using Cursor & MDC Rules

This application can be modified as needed by using the [app-requirements.mdc](.cursor/rules/app-requirements.mdc) file. This file allows you to specify various settings and parameters for the application in a structured format that can be used along with [Cursor's](https://www.cursor.com/) AI Powered Code Editor.

### Using the `app-requirements.mdc` File

1. Clone or Fork this repo.
2. Modify the `app-requirements.mdc`
3. Add the necessary configuration settings in the file.
4. You can refer to the MDC file used to help build this starter application by reviewing [app-requirements.mdc](.cursor/rules/app-requirements.mdc)

## Testing

Test the application with:

```bash
npm run test
```

## Getting Help

- Join our [Discord community](https://discord.gg/deepgram) for support
- Found a bug? [Create an issue](https://github.com/deepgram-starters/node-voice-agent/issues)
- Have a feature request? [Submit it here](https://github.com/deepgram-starters/node-voice-agent/issues)

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## Security

For security concerns, please review our [Security Policy](SECURITY.md).

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## License

This project is licensed under the terms specified in [LICENSE](LICENSE).
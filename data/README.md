# Website Data Collection

This directory contains the website data collected by Kai, the My Site dot AI onboarding assistant.

## Data Structure

Each conversation generates a JSON file with the following structure:

```json
{
  "businessDescription": "Description of the user's business",
  "brandName": "Name of the user's brand",
  "websiteGoal": "Main goal of the website",
  "visitorAction": "What visitors should do on the site",
  "designStyle": "Preferred design style",
  "additionalServices": "Additional services requested",
  "phoneNumber": "User's phone number for WhatsApp delivery",
  "timestamp": "2024-01-01T12:00:00.000Z"
}
```

## File Naming Convention

Files are named with the pattern: `website_data_[timestamp].json`

## Data Usage

This data is used to:
1. Personalize the user's website experience
2. Generate customized website content
3. Send the completed website to the user's WhatsApp
4. Improve the onboarding process

## Privacy

- Only business-related information is collected
- Phone numbers are used solely for WhatsApp delivery
- No sensitive personal information is stored
- Data is stored locally for processing

## Data Processing

The collected data is automatically processed to:
- Extract key business information
- Identify design preferences
- Determine website goals and visitor actions
- Prepare for website generation and WhatsApp delivery 
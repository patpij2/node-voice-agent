import { createClient, AgentEvents } from '@deepgram/sdk';
import { WebSocket } from 'ws';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const DEEPGRAM_API_KEY = process.env.DEEPGRAM_API_KEY;

if (!DEEPGRAM_API_KEY) {
  console.error('Please set your DEEPGRAM_API_KEY in the .env file');
  process.exit(1);
}

// Initialize Deepgram
const deepgram = createClient(DEEPGRAM_API_KEY);

// Data collection interface for website information
interface WebsiteData {
  businessDescription?: string;
  brandName?: string;
  websiteGoal?: string;
  visitorAction?: string;
  designStyle?: string;
  additionalServices?: string;
  phoneNumber?: string;
  timestamp: Date;
}

// Global variable to store collected data
let collectedData: WebsiteData = {
  timestamp: new Date()
};

// Function to save collected data
function saveWebsiteData(data: WebsiteData) {
  const dataDir = path.join(__dirname, '../data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  const filename = `website_data_${Date.now()}.json`;
  const filepath = path.join(dataDir, filename);
  
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
    console.log(`Website data saved to: ${filepath}`);
  } catch (error) {
    console.error('Error saving website data:', error);
  }
}

// Create HTTP server to serve the static HTML file
const server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile(path.join(__dirname, '../static/index.html'), (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading index.html');
        return;
      }
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  }
});

// Function to connect to Deepgram Voice Agent
async function connectToAgent() {
  try {
    // Create an agent connection
    const agent = deepgram.agent();

    // Set up event handlers
    agent.on(AgentEvents.Open, () => {
      console.log('Agent connection established');
    });

    agent.on('Welcome', (data) => {
      console.log('Server welcome message:', data);
      agent.configure({
        audio: {
          input: {
            encoding: 'linear16',
            sample_rate: 32000
          },
          output: {
            encoding: 'linear16',
            sample_rate: 32000,
            container: 'none'
          }
        },
        agent: {
          listen: {
            provider: {
              type: 'deepgram',
              model: 'nova-3'
            }
          },
          think: {
            provider: {
              type: 'open_ai',
              model: 'gpt-4o-mini'
            },
            prompt: `You are Kai, a friendly and helpful onboarding assistant for My Site dot AI. You're enthusiastic about helping new users get the most out of the platform.

## 🧠 Personality
- You are patient and understanding, especially with users who may not be tech-savvy
- You're efficient and focused on gathering the right information to personalize the experience
- You're warm, welcoming, and encouraging
- You're conversational — avoid technical jargon or complex language
- Show genuine enthusiasm for the user's business
- Use active listening cues like: "Okay," "Great," "Got it"
- Offer positive reinforcement and be extra patient with less tech-savvy users

## 🎯 Goal
Help personalize the user's experience by collecting essential information about their business and website needs.

## 📋 Onboarding Flow
1. **Welcome & Introduction**: Greet the user and introduce yourself as Kai from My Site dot AI. Mention you're here to help them get started quickly and easily. Let them know the website will be sent to their WhatsApp after the call.

2. **Collect Information** (ask these naturally and conversationally):
   - "Can you describe your business in a few sentences?"
   - "What's the name of your brand?"
   - "What's the main goal of your website?"
   - "What do you want visitors to do on your site?" (e.g. make a purchase, contact you, learn more)
   - "How should the website feel — design-wise?" (e.g. modern, playful, professional)
   - "Would you like help with anything else?" (e.g. ads, content, social media)
   - "What's your phone number so we can send the website to your WhatsApp?"

3. **Wrap-up**: Thank them for sharing, briefly explain how the info helps personalize their site, let them know the website will be sent via WhatsApp shortly.

## 🚧 Important Guidelines
- Always say the platform name as "My Site dot AI", not "mysite.ai"
- Don't assume any technical expertise — ask, don't guess
- Stay calm, clear, and helpful if the user is confused
- Never ask for sensitive personal info beyond business details and phone number
- Avoid financial, legal, or professional advice
- Stay focused on their business and website goals
- Keep it appropriate and professional at all times
- Keep responses concise and conversational
- Listen actively and ask follow-ups if something is unclear

Remember that you have a voice interface. You can listen and speak, and all your responses will be spoken aloud.`
          },
          speak: {
            provider: {
              type: 'deepgram',
              model: 'aura-arcas-en'
            }
          },
          greeting: "Hi there! I'm Kai, your friendly onboarding assistant from My Site dot AI. I'm here to help you get started quickly and easily. After our chat, I'll send your personalized website directly to your WhatsApp. How are you doing today?"
        }
      });
    });

    agent.on('SettingsApplied', (data) => {
      console.log('Server confirmed settings:', data);
    });

    agent.on(AgentEvents.AgentStartedSpeaking, (data: { total_latency: number }) => {
      // Remove unnecessary latency logging
    });

    agent.on(AgentEvents.ConversationText, (message: { role: string; content: string }) => {
      // Log conversation and extract data
      console.log(`${message.role}: ${message.content}`);
      
      // Extract data from user responses
      if (message.role === 'user') {
        const content = message.content.toLowerCase();
        
        // Simple keyword-based data extraction
        if (content.includes('business') || content.includes('company') || content.includes('work')) {
          collectedData.businessDescription = message.content;
        }
        
        if (content.includes('brand') || content.includes('name') || content.includes('called')) {
          // Extract brand name - look for patterns like "my brand is X" or "it's called X"
          const brandMatch = message.content.match(/(?:brand|name|called)\s+(?:is\s+)?([A-Za-z0-9\s&]+)/i);
          if (brandMatch) {
            collectedData.brandName = brandMatch[1].trim();
          }
        }
        
        if (content.includes('goal') || content.includes('purpose') || content.includes('want')) {
          collectedData.websiteGoal = message.content;
        }
        
        if (content.includes('visitor') || content.includes('customer') || content.includes('buy') || content.includes('contact')) {
          collectedData.visitorAction = message.content;
        }
        
        if (content.includes('design') || content.includes('style') || content.includes('modern') || content.includes('professional') || content.includes('playful')) {
          collectedData.designStyle = message.content;
        }
        
        if (content.includes('help') || content.includes('service') || content.includes('ad') || content.includes('social')) {
          collectedData.additionalServices = message.content;
        }
        
        // Extract phone number
        const phoneMatch = message.content.match(/(\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
        if (phoneMatch) {
          collectedData.phoneNumber = phoneMatch[0];
        }
      }
    });

    agent.on(AgentEvents.Audio, (audio: Buffer) => {
      if (browserWs?.readyState === WebSocket.OPEN) {
        try {
          // Send the audio buffer directly without additional conversion
          browserWs.send(audio, { binary: true });
        } catch (error) {
          console.error('Error sending audio to browser:', error);
        }
      }
    });

    agent.on(AgentEvents.Error, (error: Error) => {
      console.error('Agent error:', error);
    });

    agent.on(AgentEvents.Close, () => {
      console.log('Agent connection closed');
      
      // Save collected data when conversation ends
      if (Object.keys(collectedData).length > 1) { // More than just timestamp
        console.log('Saving collected website data:', collectedData);
        saveWebsiteData(collectedData);
      }
      
      if (browserWs?.readyState === WebSocket.OPEN) {
        browserWs.close();
      }
    });

    return agent;
  } catch (error) {
    console.error('Error connecting to Deepgram:', error);
    process.exit(1);
  }
}

// Create WebSocket server for browser clients
const wss = new WebSocket.Server({ server });
let browserWs: WebSocket | null = null;

wss.on('connection', async (ws) => {
  // Reset collected data for new session
  collectedData = {
    timestamp: new Date()
  };
  
  console.log('Browser client connected - Starting new onboarding session');
  browserWs = ws;

  const agent = await connectToAgent();

  ws.on('message', (data: Buffer) => {
    try {
      console.log(`Received audio data from browser: ${data.length} bytes`);
      if (agent) {
        agent.send(data);
      }
    } catch (error) {
      console.error('Error sending audio to agent:', error);
    }
  });

  ws.on('close', async () => {
    if (agent) {
      await agent.disconnect();
    }
    browserWs = null;
    console.log('Browser client disconnected');
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
const serverInstance = server.listen(PORT, () => {
  console.log(`Kai - My Site dot AI Onboarding Assistant running at http://localhost:${PORT}`);
  console.log('Ready to collect website data from new users!');
});

// Graceful shutdown handler
function shutdown() {
  console.log('\nShutting down Kai onboarding assistant...');

  // Set a timeout to force exit if graceful shutdown takes too long
  const forceExit = setTimeout(() => {
    console.error('Force closing due to timeout');
    process.exit(1);
  }, 5000);

  // Track pending operations
  let pendingOps = {
    ws: true,
    http: true
  };

  // Function to check if all operations are complete
  const checkComplete = () => {
    if (!pendingOps.ws && !pendingOps.http) {
      clearTimeout(forceExit);
      console.log('Server shutdown complete');
      process.exit(0);
    }
  };

  // Close all WebSocket connections
  wss.clients.forEach((client) => {
    try {
      client.close();
    } catch (err) {
      console.error('Error closing WebSocket client:', err);
    }
  });

  wss.close((err) => {
    if (err) {
      console.error('Error closing WebSocket server:', err);
    } else {
      console.log('WebSocket server closed');
    }
    pendingOps.ws = false;
    checkComplete();
  });

  // Close the HTTP server
  serverInstance.close((err) => {
    if (err) {
      console.error('Error closing HTTP server:', err);
    } else {
      console.log('HTTP server closed');
    }
    pendingOps.http = false;
    checkComplete();
  });
}

// Handle shutdown signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default serverInstance;
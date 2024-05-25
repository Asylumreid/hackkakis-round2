const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs'); // Required for logging feedback to a file

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token obtained from BotFather
const token = '7181853156:AAGE_ojiCE57aVvwHVWNshk81Tu55Ul_Vjk';
const bot = new TelegramBot(token, { polling: true });

const userState = {};

// Function to send the main menu
function sendMainMenu(chatId) {
  bot.sendMessage(chatId, 'Welcome to Public Transport Bot! How can I assist you today?', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Help', callback_data: 'help' }],
        [{ text: 'Plan Route', callback_data: 'planroute' }],
        [{ text: 'Calculate Fees', callback_data: 'calculatefees' }],
        [{ text: 'Provide Feedback', callback_data: 'feedback' }]
      ]
    }
  });
}

// Function to handle initialization of user state
function initializeUserState(chatId) {
  if (!userState[chatId]) {
    userState[chatId] = { stage: 'initial' };
  }
}

// Start the bot with a greeting message
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  initializeUserState(chatId);

  if (!text.startsWith('/')) {
    sendMainMenu(chatId);
  }
});

// Handle callback queries from inline buttons
bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const action = callbackQuery.data;

  initializeUserState(chatId);

  if (action === 'help') {
    const helpMessage = `
    Here are the available commands:
    /start - Start a conversation with the bot
    /help - Display this help message
    /planroute - Plan a public transport route
    /calculatefees - Calculate fees for a route

    Examples:
    - Type "Plan route from [Start] to [Destination]" to get route planning.
    - Type "Calculate fees from [Start] to [Destination]" to get fee calculation.
    `;
    bot.sendMessage(chatId, helpMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[{ text: 'Back to Main Menu', callback_data: 'mainmenu' }]]
      }
    });
  } else if (action === 'planroute') {
    userState[chatId].stage = 'planningRoute';
    bot.sendMessage(chatId, 'Please enter your starting point and destination.');
  } else if (action === 'calculatefees') {
    userState[chatId].stage = 'calculatingFees';
    bot.sendMessage(chatId, 'Please enter your route details to calculate fees.');
  } else if (action === 'feedback') {
    userState[chatId].stage = 'providingFeedback';
    bot.sendMessage(chatId, 'Please enter your feedback:');
  } else if (action === 'mainmenu') {
    sendMainMenu(chatId);
  }
});

// Handle other messages and user states
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Ignore messages that start with a slash (they are commands)
  if (text.startsWith('/')) {
    return;
  }

  initializeUserState(chatId);

  const currentState = userState[chatId];

  if (currentState.stage === 'initial') {
    if (text.includes('route')) {
      currentState.stage = 'planningRoute';
      bot.sendMessage(chatId, 'Please enter your starting point and destination.');
    } else if (text.includes('fees')) {
      currentState.stage = 'calculatingFees';
      bot.sendMessage(chatId, 'Please enter your route details to calculate fees.');
    } else {
      bot.sendMessage(chatId, 'I didn\'t understand that. Type /help for a list of available commands.', {
        reply_markup: {
          inline_keyboard: [
            [{ text: 'Help', callback_data: 'help' }],
            [{ text: 'Plan Route', callback_data: 'planroute' }],
            [{ text: 'Calculate Fees', callback_data: 'calculatefees' }],
            [{ text: 'Provide Feedback', callback_data: 'feedback' }]
          ]
        }
      });
    }
  } else if (currentState.stage === 'planningRoute') {
    // Implement route planning logic here
    bot.sendMessage(chatId, `Planning route from ${text}...`);
    currentState.stage = 'initial'; // Reset stage after processing
  } else if (currentState.stage === 'calculatingFees') {
    // Implement fee calculation logic here
    bot.sendMessage(chatId, `Calculating fees for route ${text}...`);
    currentState.stage = 'initial'; // Reset stage after processing
  } else if (currentState.stage === 'providingFeedback') {
    // Log the feedback to a file
    const feedback = `Feedback from ${chatId}: ${text}\n`;
    fs.appendFile('feedback.log', feedback, (err) => {
      if (err) throw err;
      console.log('Feedback saved!');
    });
    bot.sendMessage(chatId, 'Thank you for your feedback!', {
      reply_markup: {
        inline_keyboard: [[{ text: 'Back to Main Menu', callback_data: 'mainmenu' }]]
      }
    });
    currentState.stage = 'initial'; // Reset stage after processing
  }
});

// Gracefully handle errors
bot.on('polling_error', (error) => {
  console.error(`Polling error: ${error.code} - ${error.message}`);
});

console.log('Bot is running...');
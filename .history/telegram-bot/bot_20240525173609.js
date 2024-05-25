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
    userState[chatId] = { stage: 'initial', data: {} };
  }
}

// Log user input live
function logUserInput(chatId, input) {
  const logMessage = `User ${chatId} input: ${input}\n`;
  fs.appendFile('user_input.log', logMessage, (err) => {
    if (err) throw err;
    console.log('User input logged:', logMessage);
  });
}

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
    userState[chatId].stage = 'planningRouteStart';
    bot.sendMessage(chatId, 'Please enter your starting point:');
  } else if (action === 'calculatefees') {
    userState[chatId].stage = 'calculatingFeesStart';
    bot.sendMessage(chatId, 'Please enter your starting point:');
  } else if (action === 'feedback') {
    userState[chatId].stage = 'providingFeedbackRating';
    bot.sendMessage(chatId, 'Please rate your experience out of 5:', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '1', callback_data: 'rating_1' }],
          [{ text: '2', callback_data: 'rating_2' }],
          [{ text: '3', callback_data: 'rating_3' }],
          [{ text: '4', callback_data: 'rating_4' }],
          [{ text: '5', callback_data: 'rating_5' }],
          [{ text: 'Back to Main Menu', callback_data: 'mainmenu' }]
        ]
      }
    });
  } else if (action.startsWith('rating_')) {
    const rating = action.split('_')[1];
    userState[chatId].data.rating = rating;
    userState[chatId].stage = 'providingFeedbackText';
    bot.sendMessage(chatId, 'Thank you! Please enter your feedback:');
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

  // Log user input live
  logUserInput(chatId, text);

  const currentState = userState[chatId];

  if (currentState.stage === 'planningRouteStart') {
    currentState.data.start = text;
    currentState.stage = 'planningRouteEnd';
    bot.sendMessage(chatId, 'Please enter your destination:');
  } else if (currentState.stage === 'planningRouteEnd') {
    currentState.data.end = text;
    bot.sendMessage(chatId, `Planning route from ${currentState.data.start} to ${currentState.data.end}...`);
    currentState.stage = 'initial'; // Reset stage after processing
  } else if (currentState.stage === 'calculatingFeesStart') {
    currentState.data.start = text;
    currentState.stage = 'calculatingFeesEnd';
    bot.sendMessage(chatId, 'Please enter your destination:');
  } else if (currentState.stage === 'calculatingFeesEnd') {
    currentState.data.end = text;
    bot.sendMessage(chatId, `Calculating fees for route from ${currentState.data.start} to ${currentState.data.end}...`);
    currentState.stage = 'initial'; // Reset stage after processing
  } else if (currentState.stage === 'providingFeedbackText') {
    const feedback = `Feedback from ${chatId}: Rating: ${currentState.data.rating}, Text: ${text}\n`;
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
  } else if (currentState.stage === 'initial') {
    bot.sendMessage(chatId, 'Please choose an option from the menu.', {
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
});

// Gracefully handle errors
bot.on('polling_error', (error) => {
  console.error(`Polling error: ${error.code} - ${error.message}`);
});

console.log('Bot is running...');
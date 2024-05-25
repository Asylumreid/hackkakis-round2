const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs'); // Required for logging feedback to a file

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token obtained from BotFather
const token = '7181853156:AAGE_ojiCE57aVvwHVWNshk81Tu55Ul_Vjk';
const bot = new TelegramBot(token, { polling: true });

const userState = {};

// Placeholder travel options
const travelOptions = [
  {
    id: 1,
    time: '58 min',
    cost: '$2.50',
    details: 'Walk 7 min, 500m to One North MRT, Train from One North to Buona Vista 1 min (1 Stop),Bus 12 from Bus Stop A to Bus Stop B, then walk 10 min to Destination',
    sortKey: 58,
  },
  {
    id: 2,
    time: '1 hr 5 min',
    cost: '$2.00',
    details: 'Train CC from Station X to Station Y, then walk 5 min to Destination',
    sortKey: 65,
  },
  {
    id: 3,
    time: '1 hr 9 min',
    cost: '$1.80',
    details: 'Bus 10 from Bus Stop C to Bus Stop D, then train EW from Station Z to Station W, then walk 15 min to Destination',
    sortKey: 69,
  },
];

// Function to send the main menu
function sendMainMenu(chatId) {
  bot.sendMessage(chatId, 'Welcome to Public Transport Bot! How can I assist you today?', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Help', callback_data: 'help' }],
        [{ text: 'Plan Route', callback_data: 'planroute' }],
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

// Function to display travel options
function displayTravelOptions(chatId) {
  const sortedOptions = travelOptions.sort((a, b) => a.sortKey - b.sortKey);
  const optionsText = sortedOptions.map((option, index) => {
    return `${index + 1}. Time: ${option.time}, Cost: ${option.cost}`;
  }).join('\n');

  bot.sendMessage(chatId, `Here are your travel options:\n${optionsText}`, {
    reply_markup: {
      inline_keyboard: sortedOptions.map((option) => [{
        text: `Option ${option.id}`,
        callback_data: `travel_option_${option.id}`,
      }]),
    },
  });
}

// Function to display detailed trip information
function displayTripDetails(chatId, optionId) {
  const option = travelOptions.find((opt) => opt.id === optionId);
  if (option) {
    bot.sendMessage(chatId, `Details for Option ${option.id}:\nTime: ${option.time}\nCost: ${option.cost}\nDetails: ${option.details}`, {
      reply_markup: {
        inline_keyboard: [[{ text: 'Back to Main Menu', callback_data: 'mainmenu' }]],
      },
    });
  } else {
    bot.sendMessage(chatId, 'Invalid option selected.', {
      reply_markup: {
        inline_keyboard: [[{ text: 'Back to Main Menu', callback_data: 'mainmenu' }]],
      },
    });
  }
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

    Examples:
    - Type "Plan route from [Start] to [Destination]" to get route planning.
    `;
    bot.sendMessage(chatId, helpMessage, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [[{ text: 'Back to Main Menu', callback_data: 'mainmenu' }]]
      }
    });
  } else if (action === 'planroute') {
    userState[chatId].stage = 'chooseLocationOption';
    bot.sendMessage(chatId, 'Would you like to share your location or enter the start point manually?', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Share Location', callback_data: 'share_location' }],
          [{ text: 'Enter Manually', callback_data: 'enter_manually' }]
        ]
      }
    });
  } else if (action === 'share_location') {
    userState[chatId].data.start = 'Eclipse, 1 Fusionopolis Vw, Singapore 138577';
    userState[chatId].stage = 'planningRouteEnd';
    bot.sendMessage(chatId, 'Location set to Eclipse, 1 Fusionopolis Vw, Singapore 138577. Please enter your destination:');
  } else if (action === 'enter_manually') {
    userState[chatId].stage = 'planningRouteStart';
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
  } else if (action.startsWith('travel_option_')) {
    const optionId = parseInt(action.split('_')[2], 10);
    displayTripDetails(chatId, optionId);
  }
});

// Handle other messages and user states
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // If this is the first message, send the main menu
  if (!userState[chatId]) {
    sendMainMenu(chatId);
    initializeUserState(chatId);
    return;
  }

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
    displayTravelOptions(chatId);
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

console.log('Bot is running…');
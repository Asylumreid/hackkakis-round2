const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs'); // Required for logging feedback to a file

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token obtained from BotFather
const token = 'YOUR_TELEGRAM_BOT_TOKEN';
const bot = new TelegramBot(token, { polling: true });

const userState = {};

// Placeholder travel options
const travelOptions = [
  {
    id: 1,
    time: '58 min🚶🏼🚝',
    cost: '$2.50',
    details: 'Walk 7 min, (500m) to One North MRT, Train from One North to Buona Vista 1 min (1 Stop), Train from Buona Vista to City Hall, then walk 10 min (600m) to SMU',
    sortKey: 58,
  },
  {
    id: 2,
    time: '1 hr 12 min',
    cost: '$2.00',
    details: 'Walk 15 min, (1.1km) to Buona Vista MRT, Train from Buona Vista to City Hall 15 min (8 Stops), then walk 10 min (600m) to SMU',
    sortKey: 65,
  },
  {
    id: 3,
    time: '1 hr 9 min',
    cost: '$1.80.',
    details: 'Walk 7 min, (500m) to One North MRT, Train from One North to Bras Basah (20 Stops), then walk 3 min (160m) to SMU',
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

    // Send notifications after 5 seconds, 10 seconds, and 15 seconds for option 1
    if (option.id === 1) {
      setTimeout(() => {
        bot.sendMessage(chatId, 'The next stop is Buona Vista, please alight now.');
      }, 5000); // 5 seconds

      setTimeout(() => {
        bot.sendMessage(chatId, 'The next stop is City Hall, please alight now.');
      }, 10000); // 10 seconds

      setTimeout(() => {
        bot.sendMessage(chatId, 'You are near your destination.');
      }, 15000); // 15 seconds

      setTimeout(() => {
        bot.sendMessage(chatId, 'Have you arrived?', {
          reply_markup: {
            inline_keyboard: [
              [{ text: 'I have arrived', callback_data: 'arrived' }]
            ]
          }
        });
      }, 20000); // 20 seconds
    }
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
  } else if (action === 'arrived') {
    bot.sendMessage(chatId, 'Great! Glad you made it to your destination. 😊', {
      reply_markup: {
        inline_keyboard: [[{ text: 'Back to Main Menu', callback_data: 'mainmenu' }]],
      },
    });
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
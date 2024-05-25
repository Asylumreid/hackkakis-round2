const TelegramBot = require('node-telegram-bot-api');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token obtained from BotFather
const token = '7181853156:AAGE_ojiCE57aVvwHVWNshk81Tu55Ul_Vjk';
const bot = new TelegramBot(token, { polling: true });

// Respond to /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to Public Transport Bot! How can I assist you today?', {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Help', callback_data: 'help' }],
        [{ text: 'Plan Route', callback_data: 'planroute' }],
        [{ text: 'Calculate Fees', callback_data: 'calculatefees' }]
      ]
    }
  });
});

// Handle callback queries from inline buttons
bot.on('callback_query', (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const action = callbackQuery.data;

  if (action === 'help') {
    const helpMessage = `
    Here are the available commands:
    /start - Start a conversation with the bot
    /help - Display this help message
    /planroute - Plan a public transport route
    /calculatefees - Calculate fees for a route
    `;
    bot.sendMessage(chatId, helpMessage);
  } else if (action === 'planroute') {
    bot.sendMessage(chatId, 'Please enter your starting point and destination.');
    // Here you can add more logic to handle route planning
  } else if (action === 'calculatefees') {
    bot.sendMessage(chatId, 'Please enter your route details to calculate fees.');
    // Here you can add more logic to handle fee calculation
  }
});

// Handle other messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Ignore messages that start with a slash (they are commands)
  if (text.startsWith('/')) {
    return;
  }

  // Add logic to handle messages based on user input
  if (text.includes('route')) {
    bot.sendMessage(chatId, 'It looks like you want to plan a route. Please provide more details.');
    // Implement route planning logic here
  } else if (text.includes('fees')) {
    bot.sendMessage(chatId, 'It looks like you want to calculate fees. Please provide more details.');
    // Implement fee calculation logic here
  } else {
    bot.sendMessage(chatId, 'I didn\'t understand that. Type /help for a list of available commands.');
  }
});

// Gracefully handle errors
bot.on('polling_error', (error) => {
  console.error(`Polling error: ${error.code} - ${error.message}`);
});

console.log('Bot is running...');
const TelegramBot = require('node-telegram-bot-api');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token obtained from BotFather
const token = '7181853156:AAGE_ojiCE57aVvwHVWNshk81Tu55Ul_Vjk';
const bot = new TelegramBot(token, { polling: true });

// Respond to /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to Public Transport Bot! How can I assist you today?\n\nType /help for a list of available commands.');
});

// Respond to /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  const helpMessage = `
  Here are the available commands:
  /start - Start a conversation with the bot
  /help - Display this help message
  /planroute - Plan a public transport route
  /calculatefees - Calculate fees for a route
  `;
  bot.sendMessage(chatId, helpMessage);
});

// Handle other messages
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'I didn\'t understand that. Type /help for a list of available commands.');
});

console.log('Bot is running...');

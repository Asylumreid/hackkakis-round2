const TelegramBot = require('node-telegram-bot-api');

// Replace 'YOUR_TELEGRAM_BOT_TOKEN' with your actual bot token obtained from BotFather
const token = '7181853156:AAGE_ojiCE57aVvwHVWNshk81Tu55Ul_Vjk';
const bot = new TelegramBot(token, { polling: true });

// Respond to /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Hello! I am your Telegram bot. How can I assist you today?');
});

// Echo messages back to the user
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text.toLowerCase(); // Convert message to lowercase for case-insensitive matching

  // Check for specific keywords or commands
  if (message.includes('hello')) {
    bot.sendMessage(chatId, 'Hello there!');
  } else if (message.includes('help')) {
    bot.sendMessage(chatId, 'How can I help you?');
  } else {
    bot.sendMessage(chatId, 'I didn\'t understand that. Please try again.');
  }
});

console.log('Bot is running...');

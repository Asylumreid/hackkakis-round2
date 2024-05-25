require('dotenv').config();

console.log('Environment Variables:', process.env); // Debug log to print all environment variables
console.log('Telegram Bot Token:', process.env.TELEGRAM_BOT_TOKEN); // Debug log to verify token

const express = require('express');
const next = require('next');
const axios = require('axios');
const cheerio = require('cheerio');
const { Telegraf } = require('telegraf');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome! Send me your location or a place name.'));
bot.on('text', async (ctx) => {
  const location = ctx.message.text;
  const data = await fetchTransportInfo(location);
  ctx.reply(data);
});

async function fetchTransportInfo(location) {
  try {
    const response = await axios.get(`https://gothere.sg/directions?query=${location}`);
    const $ = cheerio.load(response.data);

    // Example of extracting transport information from the page
    const transportInfo = $('.some-css-selector').text(); // Replace with actual selector

    return transportInfo || 'No transport info found.';
  } catch (error) {
    console.error('Error fetching transport info:', error);
    return 'Failed to fetch transport information.';
  }
}

app.prepare().then(() => {
  const server = express();

  server.use(bot.webhookCallback('/secret-path'));
  bot.telegram.setWebhook(`https://your-domain.com/secret-path`);

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = process.env.PORT || 3000;
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});



// Gracefully handle errors
bot.on('polling_error', (error) => {
    console.error(`Polling error: ${error.code} - ${error.message}`);
});

console.log('Bot is running…');
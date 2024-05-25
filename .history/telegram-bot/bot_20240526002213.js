
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
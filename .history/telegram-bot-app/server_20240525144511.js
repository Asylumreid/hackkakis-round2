pangjiacheng@Pangs-MacBook-Pro hackkakis-round2 % cd telegram-bot-app
pangjiacheng@Pangs-MacBook-Pro telegram-bot-app % npm install dotenv

added 1 package, and audited 452 packages in 7s

150 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
pangjiacheng@Pangs-MacBook-Pro telegram-bot-app % npm run dev        

> telegram-bot-app@0.1.0 dev
> node server.js

Telegram Bot Token: undefined
(node:32822) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
> Ready on http://localhost:3000
 ⨯ unhandledRejection: TelegramError: 401: Bot Token is required
    at Telegram.callApi (/Users/pangjiacheng/Documents/GitHub/hackkakis-round2/telegram-bot-app/node_modules/telegraf/lib/core/network/client.js:290:19)
    at Telegram.setWebhook (/Users/pangjiacheng/Documents/GitHub/hackkakis-round2/telegram-bot-app/node_modules/telegraf/lib/telegram.js:87:21)
    at /Users/pangjiacheng/Documents/GitHub/hackkakis-round2/telegram-bot-app/server.js:43:16 {
  response: { error_code: 401, description: 'Bot Token is required' },
  on: {}
}
 ⨯ unhandledRejection: TelegramError: 401: Bot Token is required
    at Telegram.callApi (/Users/pangjiacheng/Documents/GitHub/hackkakis-round2/telegram-bot-app/node_modules/telegraf/lib/core/network/client.js:290:19)
    at Telegram.setWebhook (/Users/pangjiacheng/Documents/GitHub/hackkakis-round2/telegram-bot-app/node_modules/telegraf/lib/telegram.js:87:21)
    at /Users/pangjiacheng/Documents/GitHub/hackkakis-round2/telegram-bot-app/server.js:43:16 {
  response: { error_code: 401, description: 'Bot Token is required' },
  on: {}
}
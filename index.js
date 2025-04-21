const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text?.toLowerCase();

  if (text === '/start') {
    bot.sendMessage(chatId, '🎉 ¡Bienvenido a loterIA – Apuestas estadísticas por IA!');
  } else {
    bot.sendMessage(chatId, '🤖 Comando no reconocido. Usa /start para comenzar.');
  }
});

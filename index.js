const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// 🚨 REEMPLAZA estos valores
const TOKEN = '7386316601:AAFQqeUQe5613vT_fuB7REvvghOWMNhBNDI'; // <- Sustituye con tu token de BotFather
const ADMIN_ID = 2132105874; // <- Sustituye con tu ID personal de Telegram (número)

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `👋 ¡Bienvenido a *loterIA*!

Este bot te permitirá participar en nuestra peña y gestionar tus pagos de forma sencilla.

Comandos disponibles:
/pago - Registrar tu pago
/estado - Consultar tu estado de pago

¡Buena suerte! 🍀`, { parse_mode: 'Markdown' });
});

bot.onText(/\/pago/, (msg) => {
  const chatId = msg.chat.id;
  const user = msg.from;
  const username = user.username || `${user.first_name} ${user.last_name || ""}`;
  const adminChatId = ADMIN_ID;

  const registro = {
    id: user.id,
    username: username.trim(),
    fecha: new Date().toISOString(),
    estado: "pendiente"
  };

  const pagos = fs.existsSync('pagos.json') ? JSON.parse(fs.readFileSync('pagos.json')) : [];
  pagos.push(registro);
  fs.writeFileSync('pagos.json', JSON.stringify(pagos, null, 2));

  bot.sendMessage(chatId, `📥 Gracias ${username}, hemos registrado tu aviso de pago. Un administrador lo confirmará pronto.`);

  bot.sendMessage(adminChatId, `📬 Nuevo pago pendiente de ${username} (ID: ${user.id})`, {
    reply_markup: {
      inline_keyboard: [[
        { text: `✅ Confirmar pago de ${username}`, callback_data: `confirmar_${user.id}` }
      ]]
    }
  });
});

bot.on('callback_query', (callbackQuery) => {
  const data = callbackQuery.data;

  if (data.startsWith("confirmar_")) {
    const userId = parseInt(data.split("_")[1]);
    const pagos = JSON.parse(fs.readFileSync('pagos.json'));
    const index = pagos.findIndex(p => p.id === userId && p.estado === "pendiente");

    if (index !== -1) {
      pagos[index].estado = "confirmado";
      fs.writeFileSync('pagos.json', JSON.stringify(pagos, null, 2));
      bot.sendMessage(callbackQuery.message.chat.id, `✅ Confirmado: pago de ${pagos[index].username}.`);
      bot.sendMessage(userId, `✅ Tu cuota ha sido confirmada. ¡Gracias por participar!`);
    } else {
      bot.sendMessage(callbackQuery.message.chat.id, `⚠️ No hay pagos pendientes para ese ID.`);
    }

    bot.answerCallbackQuery(callbackQuery.id);
  }
});

bot.onText(/\/confirmar (\d+)/, (msg, match) => {
  if (msg.from.id !== ADMIN_ID) {
    return bot.sendMessage(msg.chat.id, "🚫 Solo el administrador puede confirmar pagos.");
  }

  const userId = parseInt(match[1]);
  const pagos = JSON.parse(fs.readFileSync('pagos.json'));
  const index = pagos.findIndex(p => p.id === userId && p.estado === "pendiente");

  if (index !== -1) {
    pagos[index].estado = "confirmado";
    fs.writeFileSync('pagos.json', JSON.stringify(pagos, null, 2));
    bot.sendMessage(msg.chat.id, `✅ Pago del usuario ${pagos[index].username} confirmado.`);
    bot.sendMessage(userId, `✅ Tu cuota ha sido confirmada. ¡Gracias por participar!`);
  } else {
    bot.sendMessage(msg.chat.id, `⚠️ No hay pagos pendientes para ese ID.`);
  }
});

bot.onText(/\/estado/, (msg) => {
  const pagos = fs.existsSync('pagos.json') ? JSON.parse(fs.readFileSync('pagos.json')) : [];
  const registro = pagos.filter(p => p.id === msg.from.id).pop();

  if (registro && registro.estado === "confirmado") {
    bot.sendMessage(msg.chat.id, `✅ Tu cuota está confirmada. ¡Gracias por participar!`);
  } else if (registro) {
    bot.sendMessage(msg.chat.id, `⏳ Tu pago está pendiente de confirmación. Espera un momento.`);
  } else {
    bot.sendMessage(msg.chat.id, `🚫 No hemos recibido tu pago. Usa /pago para notificarlo.`);
  }
});

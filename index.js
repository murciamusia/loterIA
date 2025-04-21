// index.js (versión CommonJS)
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const participantes = new Set();

// /start - Mensaje de bienvenida
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `👋 ¡Bienvenido a *loterIA* – Apuestas estadísticas por IA! 

Usa /apuntar para participar en la próxima jugada.

Usa /ayuda para ver todos los comandos.`, { parse_mode: "Markdown" });
});

bot.onText(/\/apuntar/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const nombre = msg.from.first_name;
  const username = msg.from.username;

  try {
    const res = await pool.query(
      'INSERT INTO usuarios (telegram_id, nombre, username) VALUES ($1, $2, $3) ON CONFLICT (telegram_id) DO NOTHING',
      [userId, nombre, username]
    );
    bot.sendMessage(chatId, `🎉 ¡${nombre}, ya estás apuntado a la peña!`);
  } catch (err) {
    console.error(err);
    bot.sendMessage(chatId, '❌ Ha ocurrido un error al registrarte.');
  }
});


// /baja - Elimina usuario
bot.onText(/\/baja/, (msg) => {
  participantes.delete(msg.from.username || msg.from.first_name);
  bot.sendMessage(msg.chat.id, `🗑️ ${msg.from.first_name}, has sido dado de baja de la jugada.`);
});

// /participantes - Muestra lista
bot.onText(/\/participantes/, (msg) => {
  if (participantes.size === 0) {
    bot.sendMessage(msg.chat.id, `📭 Aún no hay participantes.`);
  } else {
    bot.sendMessage(msg.chat.id, `👥 Participantes:\n\n${[...participantes].join('\n')}`);
  }
});

// /combinacion - Muestra combinación del día
bot.onText(/\/combinacion/, (msg) => {
  bot.sendMessage(msg.chat.id, `🎰 Combinación generada por IA para hoy:\n\n12 - 23 - 34 - 36 - 44 - 49`);
});

// /resultados - Enlace a resultados
bot.onText(/\/resultados/, (msg) => {
  bot.sendMessage(msg.chat.id, `📊 Consulta los últimos resultados oficiales de la Bonoloto aquí:\nhttps://www.loteriasyapuestas.es/es/bonoloto`);
});

// /ayuda - Comandos
bot.onText(/\/ayuda/, (msg) => {
  bot.sendMessage(msg.chat.id, `📋 *Comandos disponibles*:

/start - Bienvenida
/apuntar - Apuntarte a la próxima jugada
/baja - Salir de la peña
/participantes - Ver quién está apuntado
/combinacion - Ver la combinación del día
/resultados - Ver últimos resultados
/ayuda - Este menú

¡Gracias por usar *loterIA*! 🤖`, { parse_mode: "Markdown" });
});

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Añade esta variable en Render o Railway
  ssl: {
    rejectUnauthorized: false
  }
});


// index.js
import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
dotenv.config();

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const participantes = new Set(); // Memoria temporal. Luego podemos conectar a BD

// /start - Mensaje de bienvenida
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `👋 ¡Bienvenido a *loterIA* – Apuestas estadísticas por IA! 

Usa /apuntar para participar en la próxima jugada.

Usa /ayuda para ver todos los comandos.`, { parse_mode: "Markdown" });
});

// /apuntar - Añade usuario a la lista
bot.onText(/\/apuntar/, (msg) => {
  participantes.add(msg.from.username || msg.from.first_name);
  bot.sendMessage(msg.chat.id, `✅ ${msg.from.first_name}, te hemos apuntado para la próxima jugada.`);
});

// /baja - Quita usuario de la lista
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

// /combinacion - Combinación del día (puede conectarse a análisis)
bot.onText(/\/combinacion/, (msg) => {
  bot.sendMessage(msg.chat.id, `🎰 Combinación generada por IA para hoy:\n\n12 - 23 - 34 - 36 - 44 - 49`);
});

// /resultados - Enlace a resultados oficiales
bot.onText(/\/resultados/, (msg) => {
  bot.sendMessage(msg.chat.id, `📊 Consulta los últimos resultados oficiales de la Bonoloto aquí:\nhttps://www.loteriasyapuestas.es/es/bonoloto`);
});

// /ayuda - Muestra menú de comandos
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


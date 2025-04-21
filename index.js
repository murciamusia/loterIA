// index.js (versión CommonJS)
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

const participantes = new Map();

// /start - Mensaje de bienvenida
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    `¡Hola ${msg.from.first_name}! 👋\n\nUsa /apuntar para participar en la próxima jugada.\nUsa /ayuda para ver todos los comandos.`,
    { parse_mode: "Markdown" }
  );
});

bot.onText(/\/apuntar/, (msg) => {
  const userId = msg.from.id;
  if (participantes.has(userId)) {
    bot.sendMessage(msg.chat.id, 'Ya estás apuntado.');
  } else {
    participantes.set(userId, {
      nombre: msg.from.first_name,
      username: msg.from.username || '',
    });
    bot.sendMessage(msg.chat.id, '¡Te has apuntado con éxito!');
  }
});


// /baja - Elimina usuario
bot.onText(/\/baja/, (msg) => {
  const userId = msg.from.id;
  if (participantes.has(userId)) {
    participantes.delete(userId);
    bot.sendMessage(msg.chat.id, 'Te has dado de baja.');
  } else {
    bot.sendMessage(msg.chat.id, 'No estabas apuntado.');
  }
});

// Comando /participantes
bot.onText(/\/participantes/, (msg) => {
  if (participantes.size === 0) {
    bot.sendMessage(msg.chat.id, 'Aún no hay participantes.');
    return;
  }

  const lista = Array.from(participantes.values())
    .map((p, i) => `${i + 1}. ${p.nombre} ${p.username ? `(@${p.username})` : ''}`)
    .join('\n');

  bot.sendMessage(msg.chat.id, `👥 Participantes:\n${lista}`);
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

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Añade esta variable en Render o Railway
  ssl: {
    rejectUnauthorized: false
  }
});

bot.onText(/\/pago/, (msg) => {
  const mensaje = `💸 *Información de pago para participar en la peña "loterIA"* 💸

📌 Para participar en la próxima jugada de Bonoloto gestionada por *loterIA*, es necesario realizar el pago antes del *viernes a las 14:00h*.

✅ *Cuota por participante:*
5€ por jugada semanal

💳 *Métodos de pago:*
1. *Bizum:* \`617988897\` (Juan Antonio García)
   - Concepto: *Tu nombre o usuario de Telegram + fecha*

✅ Una vez realizado el pago, se te confirmará la participación.

🧾 *Transparencia:*
- Las combinaciones jugadas se compartirán en el chat.
- Los premios serán repartidos proporcionalmente.
- Consulta la lista de participantes con /participantes

📩 Dudas: contacta con administrador o usa /ayuda.

¡Gracias por confiar en *loterIA*! 🤖🍀`;

  bot.sendMessage(msg.chat.id, mensaje, { parse_mode: "Markdown" });
});

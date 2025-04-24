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
/bases - Reglas y bases de participación
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

// /bases - Reglas y condiciones de participación
bot.onText(/\/bases/, (msg) => {
  const texto = `📜 *Bases de Participación – Peña "loterIA"* 📜

1. *Organización*
- Peña sin ánimo de lucro gestionada por Juan Antonio García.
- Objetivo: participar colectivamente en la Bonoloto usando combinaciones generadas por IA.

2. *Cuota de participación*
- 3€ cuota de alta en la peña o reactivación.
- 5€ por semana para las apuestas. Pago antes del *viernes a las 14:00h* para las apuestas de la próxima semana.
- Bizum al número: \`617988897\` con el concepto: *Tu nombre o @usuario + fecha de pago*.

3. *Confirmación*
- El administrador confirmará tu pago y te incluirá en el sorteo semanal, confirmar participación con el comando /apuntar.
- Usa /pagos para ver quién ha pagado.

4. *Combinaciones*
- Generadas automáticamente con IA y publicadas en el grupo antes del sorteo.

5. *Premios*
- Se reparten proporcionalmente según la participación semanal.
- Se abonan por Bizum tras confirmar el premio *solo premios menores*.

6. *Transparencia*
- Combinaciones y premios se comparten públicamente.
- Puedes solicitar desglose de premios o aportaciones.

7. *Renovación*
- La participación es semanal. No hay compromiso de permanencia.

8. *Cancelación*
- Puedes salir con /baja o contactar con el administrador.

¡Gracias por formar parte de *loterIA*! 🤖🍀`;

  bot.sendMessage(msg.chat.id, texto, { parse_mode: "Markdown" });
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

// Comando separado: /confirmar_pago
bot.onText(/\/confirmar_pago (.+)/, async (msg, match) => {
  const adminId = 2132105874; // ← tu ID real de Telegram aquí

  if (msg.from.id !== adminId) {
    return bot.sendMessage(msg.chat.id, "⛔ Solo el administrador puede registrar pagos.");
  }

  const usernameOId = match[1].trim();
  const participante = Array.from(participantes.entries()).find(([id, p]) =>
    String(id) === usernameOId || p.username === usernameOId.replace('@', '')
  );

  if (!participante) {
    return bot.sendMessage(msg.chat.id, "❌ Usuario no encontrado entre los participantes.");
  }

  const [telegram_id, { nombre, username }] = participante;

  try {
    await pool.query(
      'INSERT INTO pagos (telegram_id, nombre, username, cantidad) VALUES ($1, $2, $3, $4)',
      [telegram_id, nombre, username, 5.00]
    );

    bot.sendMessage(msg.chat.id, `✅ Pago confirmado para *${nombre}* (@${username || "sin usuario"})`, {
      parse_mode: "Markdown"
    });

  } catch (err) {
    console.error("Error registrando pago:", err);
    bot.sendMessage(msg.chat.id, "⚠️ Ocurrió un error al registrar el pago.");
  }
});

// logger.js

const { createLogger, transports, format } = require('winston');
const { combine, timestamp, json } = format;
const fs = require('fs');

// Vérifier si le dossier logs existe, sinon le créer
const logsDir = './logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Créer un logger Winston avec un transport vers un fichier JSON
const logger = createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    json()
  ),
  transports: [
    new transports.File({ filename: './logs/log.json' })
  ]
});

module.exports = logger;

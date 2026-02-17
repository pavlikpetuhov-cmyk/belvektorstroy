// PM2 конфигурация для запуска бэкенда
// Файл: /var/www/belvektorstroy/ecosystem.config.js

module.exports = {
  apps: [{
    name: 'belvektorstroy-api',
    cwd: '/var/www/belvektorstroy/backend',
    script: 'uvicorn',
    args: 'server:app --host 127.0.0.1 --port 8001 --workers 2',
    interpreter: 'python3',
    env: {
      MONGO_URL: 'mongodb://localhost:27017',
      DB_NAME: 'belvektorstroy',
      CORS_ORIGINS: 'https://belvektorstroy.ru,https://www.belvektorstroy.ru'
    }
  }]
};

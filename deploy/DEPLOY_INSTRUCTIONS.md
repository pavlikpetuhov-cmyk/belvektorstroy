# Инструкция по деплою БелВекторСтрой на VPS

## Требования к серверу
- Ubuntu 20.04/22.04 LTS
- Минимум 1 GB RAM, 20 GB SSD
- Рекомендуемые хостинги: TimeWeb, REG.RU, Selectel, Beget

## 1. Подготовка сервера

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка необходимых пакетов
sudo apt install -y nginx python3 python3-pip python3-venv nodejs npm certbot python3-certbot-nginx

# Установка MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt update
sudo apt install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod

# Установка PM2 для управления процессами
sudo npm install -g pm2
```

## 2. Создание структуры директорий

```bash
sudo mkdir -p /var/www/belvektorstroy/{frontend,backend}
sudo chown -R $USER:$USER /var/www/belvektorstroy
```

## 3. Загрузка файлов на сервер

С вашего компьютера (где скачан архив):

```bash
# Загрузка фронтенда (папка build)
scp -r ./frontend/build/* user@your_server_ip:/var/www/belvektorstroy/frontend/

# Загрузка бэкенда
scp -r ./backend/* user@your_server_ip:/var/www/belvektorstroy/backend/

# Загрузка конфигураций
scp ./deploy/nginx.conf user@your_server_ip:/tmp/belvektorstroy.conf
scp ./deploy/ecosystem.config.js user@your_server_ip:/var/www/belvektorstroy/
scp ./deploy/backend.env user@your_server_ip:/var/www/belvektorstroy/backend/.env
```

## 4. Настройка бэкенда на сервере

```bash
cd /var/www/belvektorstroy/backend

# Создание виртуального окружения Python
python3 -m venv venv
source venv/bin/activate

# Установка зависимостей
pip install -r requirements.txt
pip install uvicorn

# Проверка запуска
uvicorn server:app --host 127.0.0.1 --port 8001
# Ctrl+C для остановки
```

## 5. Настройка Nginx

```bash
# Копирование конфигурации
sudo mv /tmp/belvektorstroy.conf /etc/nginx/sites-available/belvektorstroy

# Временно отключаем SSL для получения сертификата
# Отредактируйте файл, закомментировав SSL секцию

# Активация сайта
sudo ln -s /etc/nginx/sites-available/belvektorstroy /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default  # Удаляем дефолтный сайт

# Проверка конфигурации
sudo nginx -t

# Перезапуск Nginx
sudo systemctl restart nginx
```

## 6. Получение SSL сертификата

```bash
# Убедитесь что домен уже привязан к IP сервера!
sudo certbot --nginx -d belvektorstroy.ru -d www.belvektorstroy.ru
```

## 7. Запуск бэкенда через PM2

```bash
cd /var/www/belvektorstroy

# Запуск
pm2 start ecosystem.config.js

# Автозапуск при перезагрузке
pm2 startup
pm2 save
```

## 8. Настройка DNS

В панели управления доменом создайте A-записи:
- `belvektorstroy.ru` → IP вашего сервера
- `www.belvektorstroy.ru` → IP вашего сервера

## 9. Проверка работы

```bash
# Проверка Nginx
sudo systemctl status nginx

# Проверка бэкенда
pm2 status

# Проверка MongoDB
sudo systemctl status mongod

# Тест API
curl http://localhost:8001/api/
```

## Полезные команды

```bash
# Логи бэкенда
pm2 logs belvektorstroy-api

# Перезапуск бэкенда
pm2 restart belvektorstroy-api

# Логи Nginx
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# Перезапуск Nginx
sudo systemctl restart nginx
```

## Обновление сайта

```bash
# Фронтенд - просто заменить файлы
scp -r ./frontend/build/* user@server:/var/www/belvektorstroy/frontend/

# Бэкенд - заменить файлы и перезапустить
scp -r ./backend/* user@server:/var/www/belvektorstroy/backend/
ssh user@server "pm2 restart belvektorstroy-api"
```

## Рекомендуемые хостинги (Россия)

| Хостинг | Минимальная цена | Особенности |
|---------|------------------|-------------|
| TimeWeb | ~300 руб/мес | Простая панель |
| REG.RU  | ~400 руб/мес | Надёжный |
| Selectel | ~500 руб/мес | Высокая производительность |
| Beget   | ~200 руб/мес | Дёшево |

## Поддержка

При возникновении проблем проверьте:
1. Логи PM2: `pm2 logs`
2. Логи Nginx: `/var/log/nginx/error.log`
3. Статус сервисов: `systemctl status nginx mongod`

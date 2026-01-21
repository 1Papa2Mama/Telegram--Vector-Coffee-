# Vector Coffee Telegram Bot

Telegram-бот для кофейни Vector Coffee с меню, информацией, акциями, отзывами и ИИ-консультантом.

## 🚀 Запуск локально

```bash
npm install
node src/index.js
```

## 🔧 Переменные окружения

Создайте `.env` или передайте переменные окружения:

```env
BOT_TOKEN=ваш_токен_бота
ADMIN_CHAT_ID=ваш_chat_id
OPENAI_API_KEY=ваш_openai_key
OPENAI_MODEL=gpt-4o-mini
TZ=UTC
```

- `BOT_TOKEN` — обязательный.
- `ADMIN_CHAT_ID` — куда отправлять отзывы (если не задан, сервис отзывов отключается).
- `OPENAI_API_KEY` — ключ OpenAI (обязателен для ИИ).
- `OPENAI_MODEL` — модель OpenAI, можно менять без правки кода.

## 🧾 Как узнать ADMIN_CHAT_ID

1. Напишите боту `/start`, затем `/myid` — он ответит вашим `chat.id`.
2. Либо посмотрите в логи: при выполнении `/myid` бот пишет `chat.id` в консоль.

## ☁️ Деплой на Render (Web Service)

1. Создайте новый **Web Service** из репозитория.
2. **Build Command:** `npm install`
3. **Start Command:** `npm start`
4. В разделе **Environment** добавьте переменные окружения (`BOT_TOKEN`, `ADMIN_CHAT_ID`, `OPENAI_API_KEY`, `OPENAI_MODEL`).
5. Убедитесь, что сервис запускается в режиме long polling (встроено).

Готово! Бот начнёт работу после деплоя.

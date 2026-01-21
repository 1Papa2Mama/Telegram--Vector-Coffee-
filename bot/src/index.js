const TelegramBot = require("node-telegram-bot-api");
const { config } = require("./config");
const { menuItems } = require("./menuData");
const {
  mainMenuKeyboard,
  backMenuKeyboard,
  fullMenuInlineKeyboard,
  infoInlineKeyboard,
  discountsInlineKeyboard,
} = require("./ui");
const { STATES, getState, setState, clearState } = require("./state");
const { canSendReview, canAskAi } = require("./rateLimit");
const { askOpenAi } = require("./openai");

if (!config.botToken) {
  throw new Error("BOT_TOKEN is required");
}

const bot = new TelegramBot(config.botToken, { polling: true });

console.log("✅ Vector Coffee bot is starting...");

const sendMainMenu = async (chatId, name) => {
  const greeting =
    `Привет${name ? ", " + name : ""}! ☕️\n` +
    "Добро пожаловать в Vector Coffee. Выберите раздел в меню ниже 👇";
  await bot.sendMessage(chatId, greeting, mainMenuKeyboard);
};

const buildMenuText = () => {
  const lines = menuItems.map((item) => `• ${item.name} — ${item.price}`);
  return [
    "📋 Наше меню (выжимка):",
    ...lines,
    "\nПолное меню доступно на сайте.",
  ].join("\n");
};

const infoText =
  "ℹ️ Vector Coffee — уютная кофейня с акцентом на качество и заботу о гостях.\n\n" +
  "🕒 Часы работы: ежедневно 08:00–22:00\n" +
  "📍 Адрес: ул. Векторная, 12, Москва\n" +
  "📞 Телефон: +7 (900) 123-45-67\n\n" +
  "Почему выбирают нас:\n" +
  "• Свежая обжарка и отборные зерна\n" +
  "• Авторские напитки и сезонные новинки\n" +
  "• Быстрый сервис и тёплая атмосфера";

const discountsText =
  "🎁 Скидки и акции всегда актуальны на нашем сайте.\n" +
  "Переходите по ссылке, чтобы узнать подробности!";

const startReviewFlow = async (chatId) => {
  setState(chatId, STATES.REVIEW);
  await bot.sendMessage(
    chatId,
    "⭐️ Напишите ваш отзыв одним сообщением — мы обязательно прочитаем!",
    backMenuKeyboard
  );
};

const startAiFlow = async (chatId) => {
  setState(chatId, STATES.AI);
  await bot.sendMessage(
    chatId,
    "🤖 Я бариста-консультант Vector Coffee. Спрашивайте о кофе, напитках и рекомендациях!",
    backMenuKeyboard
  );
};

const handleReview = async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text?.trim();

  if (!text) {
    return;
  }

  if (!canSendReview(userId)) {
    await bot.sendMessage(
      chatId,
      "⏳ Пожалуйста, подождите пару минут перед отправкой следующего отзыва.",
      backMenuKeyboard
    );
    return;
  }

  if (!config.adminChatId) {
    await bot.sendMessage(
      chatId,
      "Сервис отзывов временно недоступен. Попробуйте позже 🙏",
      mainMenuKeyboard
    );
    clearState(chatId);
    return;
  }

  const sender = msg.from;
  const reviewMessage =
    "📝 Новый отзыв о Vector Coffee\n" +
    `От: ${sender.first_name || "Гость"}${sender.username ? ` (@${sender.username})` : ""}\n` +
    `ID: ${sender.id}\n\n"${text}"`;

  try {
    await bot.sendMessage(config.adminChatId, reviewMessage);
    await bot.sendMessage(
      chatId,
      "Спасибо за отзыв! Мы передали его команде ❤️",
      mainMenuKeyboard
    );
  } catch (error) {
    console.error("Ошибка отправки отзыва админу:", error);
    await bot.sendMessage(
      chatId,
      "Сервис отзывов временно недоступен. Попробуйте позже 🙏",
      mainMenuKeyboard
    );
  } finally {
    clearState(chatId);
  }
};

const handleAi = async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text?.trim();

  if (!text) {
    return;
  }

  if (!canAskAi(userId)) {
    await bot.sendMessage(
      chatId,
      "⏳ Немного подождите перед следующим вопросом (около 3 секунд).",
      backMenuKeyboard
    );
    return;
  }

  try {
    await bot.sendChatAction(chatId, "typing");
    const answer = await askOpenAi({
      apiKey: config.openAiApiKey,
      model: config.openAiModel,
      userMessage: text,
    });
    await bot.sendMessage(chatId, answer, backMenuKeyboard);
  } catch (error) {
    console.error("Ошибка OpenAI:", error);
    await bot.sendMessage(
      chatId,
      "Извините, сейчас сервис ИИ временно недоступен. Попробуйте позже 🙏",
      backMenuKeyboard
    );
  }
};

bot.onText(/\/(start)/, async (msg) => {
  await sendMainMenu(msg.chat.id, msg.from.first_name);
});

bot.onText(/\/(myid)/, async (msg) => {
  const chatId = msg.chat.id;
  console.log(`chat.id: ${chatId}`);
  await bot.sendMessage(
    chatId,
    `Ваш chat.id: ${chatId}`,
    mainMenuKeyboard
  );
});

bot.on("message", async (msg) => {
  if (!msg.text) {
    return;
  }

  const chatId = msg.chat.id;
  const text = msg.text.trim();

  if (text.startsWith("/")) {
    return;
  }

  if (text === "⬅️ Назад в меню") {
    clearState(chatId);
    await sendMainMenu(chatId, msg.from.first_name);
    return;
  }

  const state = getState(chatId);
  if (state === STATES.REVIEW) {
    await handleReview(msg);
    return;
  }
  if (state === STATES.AI) {
    await handleAi(msg);
    return;
  }

  switch (text) {
    case "📋 Меню":
      await bot.sendMessage(chatId, buildMenuText(), {
        ...backMenuKeyboard,
        ...fullMenuInlineKeyboard,
      });
      break;
    case "ℹ️ Инфо":
      await bot.sendMessage(chatId, infoText, {
        ...backMenuKeyboard,
        ...infoInlineKeyboard,
      });
      break;
    case "🎁 Скидки":
      await bot.sendMessage(chatId, discountsText, {
        ...backMenuKeyboard,
        ...discountsInlineKeyboard,
      });
      break;
    case "⭐️ Отзывы":
      await startReviewFlow(chatId);
      break;
    case "🤖 ИИ бот":
      await startAiFlow(chatId);
      break;
    default:
      await bot.sendMessage(chatId, "Выберите раздел в меню 👇", mainMenuKeyboard);
  }
});

bot.on("polling_error", (error) => {
  console.error("Ошибка Telegram API:", error);
});

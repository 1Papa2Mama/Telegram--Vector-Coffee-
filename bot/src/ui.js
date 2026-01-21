const MAIN_MENU_BUTTONS = [
  ["📋 Меню", "ℹ️ Инфо"],
  ["🎁 Скидки", "⭐️ Отзывы"],
  ["🤖 ИИ бот"],
];

const BACK_BUTTON = [["⬅️ Назад в меню"]];

const mainMenuKeyboard = {
  reply_markup: {
    keyboard: MAIN_MENU_BUTTONS,
    resize_keyboard: true,
    persistent: true,
  },
};

const backMenuKeyboard = {
  reply_markup: {
    keyboard: BACK_BUTTON,
    resize_keyboard: true,
    one_time_keyboard: false,
  },
};

const fullMenuInlineKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "Открыть полное меню на сайте",
          url: "https://coffee-wheel-case.onrender.com/menu",
        },
      ],
    ],
  },
};

const infoInlineKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "🌐 Открыть сайт",
          url: "https://coffee-wheel-case.onrender.com/",
        },
      ],
    ],
  },
};

const discountsInlineKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: "🎁 Открыть скидки на сайте",
          url: "https://coffee-wheel-case.onrender.com/",
        },
      ],
    ],
  },
};

module.exports = {
  mainMenuKeyboard,
  backMenuKeyboard,
  fullMenuInlineKeyboard,
  infoInlineKeyboard,
  discountsInlineKeyboard,
};

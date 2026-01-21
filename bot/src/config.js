const dotenv = require("dotenv");

dotenv.config();

const config = {
  botToken: process.env.BOT_TOKEN,
  adminChatId: process.env.ADMIN_CHAT_ID || null,
  openAiApiKey: process.env.OPENAI_API_KEY || null,
  openAiModel: process.env.OPENAI_MODEL || "gpt-4o-mini",
  tz: process.env.TZ || "UTC",
};

module.exports = { config };

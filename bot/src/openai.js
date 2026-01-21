const SYSTEM_PROMPT =
  "Ты бариста-консультант Vector Coffee. Отвечай кратко, дружелюбно, по делу, на русском, с эмодзи, избегай токсичности.";

const MAX_RESPONSE_CHARS = 1100;

const askOpenAi = async ({ apiKey, model, userMessage }) => {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const payload = {
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ],
    max_tokens: 400,
    temperature: 0.7,
  };

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const message = data?.choices?.[0]?.message?.content?.trim();

  if (!message) {
    throw new Error("Empty OpenAI response");
  }

  if (message.length > MAX_RESPONSE_CHARS) {
    return `${message.slice(0, MAX_RESPONSE_CHARS)}…`;
  }

  return message;
};

module.exports = { askOpenAi };

import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.post("/contact", async (req, res) => {
  const { name, phone, email, goal, message, lang } = req.body;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    req.log.error("Telegram credentials not configured");
    res.status(500).json({ success: false, error: "Server configuration error" });
    return;
  }

  const isRu = lang === "ru";

  const text = isRu
    ? `🎤 *Новая заявка с vocal.uz*\n\n👤 *Имя:* ${name}\n📞 *Телефон:* ${phone || "не указан"}\n📧 *Email:* ${email || "не указан"}\n🎯 *Цель:* ${goal || "не указана"}\n💬 *Сообщение:* ${message || "не указано"}`
    : `🎤 *New inquiry from vocal.uz*\n\n👤 *Name:* ${name}\n📞 *Phone:* ${phone || "not provided"}\n📧 *Email:* ${email || "not provided"}\n🎯 *Goal:* ${goal || "not provided"}\n💬 *Message:* ${message || "not provided"}`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "Markdown",
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      req.log.error({ err }, "Telegram API error");
      res.status(500).json({ success: false, error: "Failed to send message" });
      return;
    }

    res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to send Telegram message");
    res.status(500).json({ success: false, error: "Network error" });
  }
});

export default router;

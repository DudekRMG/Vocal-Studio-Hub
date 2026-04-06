import { Router, type IRouter } from "express";

const router: IRouter = Router();

router.post("/voice-range", async (req, res) => {
  const {
    name,
    contact,
    lowestNote,
    lowestHz,
    highestNote,
    highestHz,
    rangeOctaves,
    voiceType,
    page,
    timestamp,
    lang,
  } = req.body;

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    req.log.error("Telegram credentials not configured");
    res.status(500).json({ success: false, error: "Server configuration error" });
    return;
  }

  const isRu = lang === "ru";
  const octaves =
    typeof rangeOctaves === "number" ? rangeOctaves.toFixed(1) : String(rangeOctaves ?? "—");

  const text = isRu
    ? `🎵 *Тип голоса — vocal.uz*\n\n👤 *Имя:* ${name}\n📞 *Контакт:* ${contact}\n\n🎤 *Тип голоса:* ${voiceType}\n🔻 *Нижняя нота:* ${lowestNote} (${lowestHz} Гц)\n🔺 *Верхняя нота:* ${highestNote} (${highestHz} Гц)\n📏 *Диапазон:* ${octaves} октав\n\n🌐 *Страница:* ${page}\n🕐 *Время:* ${timestamp}`
    : `🎵 *Voice Range Result — vocal.uz*\n\n👤 *Name:* ${name}\n📞 *Contact:* ${contact}\n\n🎤 *Voice Type:* ${voiceType}\n🔻 *Lowest Note:* ${lowestNote} (${lowestHz} Hz)\n🔺 *Highest Note:* ${highestNote} (${highestHz} Hz)\n📏 *Range:* ${octaves} octaves\n\n🌐 *Page:* ${page}\n🕐 *Time:* ${timestamp}`;

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

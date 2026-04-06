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
    rangeSpan,
    voiceType,
    tessitura,
    confidenceLevel,
    runnerUp,
    page,
    timestamp,
    lang,
  } = req.body;

  if (
    typeof name !== "string" || name.trim() === "" ||
    typeof contact !== "string" || contact.trim() === "" ||
    typeof lowestNote !== "string" ||
    typeof highestNote !== "string" ||
    typeof lowestHz !== "number" ||
    typeof highestHz !== "number" ||
    typeof voiceType !== "string"
  ) {
    res.status(400).json({ success: false, error: "Missing or invalid fields" });
    return;
  }

  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!botToken || !chatId) {
    req.log.error("Telegram credentials not configured");
    res.status(500).json({ success: false, error: "Server configuration error" });
    return;
  }

  const isRu    = lang === "ru";
  const octaves = typeof rangeOctaves === "number" ? rangeOctaves.toFixed(1) : String(rangeOctaves ?? "—");
  const semis   = typeof rangeSpan === "number" ? String(rangeSpan) : "—";
  const tess    = typeof tessitura === "string" ? tessitura : "—";
  const conf    = typeof confidenceLevel === "string" ? confidenceLevel : "—";
  const runner  = typeof runnerUp === "string" ? runnerUp : "—";

  const confidenceLabel = (() => {
    if (!isRu) {
      if (conf === "high")   return "high";
      if (conf === "medium") return "medium";
      return "low";
    }
    if (conf === "high")   return "высокая";
    if (conf === "medium") return "средняя";
    return "низкая";
  })();

  let text: string;

  if (isRu) {
    text =
      `🎵 Тип голоса — vocal.uz\n\n` +
      `👤 Имя: ${name}\n` +
      `📞 Контакт: ${contact}\n\n` +
      `🔻 Нижняя нота: ${lowestNote} (${lowestHz} Гц)\n` +
      `🔺 Верхняя нота: ${highestNote} (${highestHz} Гц)\n` +
      `🎯 Тесситура: ${tess}\n` +
      `📏 Диапазон: ${octaves} окт. / ${semis} полутонов\n\n` +
      `🎤 Тип голоса: ${voiceType} (достоверность: ${confidenceLabel})\n`;
    if (conf !== "high") {
      text += `   Ближайший вариант: ${runner} — рекомендована ручная проверка\n`;
    }
    text += `\n🌐 Страница: ${page}\n🕐 Время: ${timestamp}`;
  } else {
    text =
      `🎵 Voice Range Result — vocal.uz\n\n` +
      `👤 Name: ${name}\n` +
      `📞 Contact: ${contact}\n\n` +
      `🔻 Lowest Note: ${lowestNote} (${lowestHz} Hz)\n` +
      `🔺 Highest Note: ${highestNote} (${highestHz} Hz)\n` +
      `🎯 Tessitura: ${tess}\n` +
      `📏 Range: ${octaves} oct. / ${semis} semitones\n\n` +
      `🎤 Voice Type: ${voiceType} (confidence: ${confidenceLabel})\n`;
    if (conf !== "high") {
      text += `   Runner-up: ${runner} — manual check recommended\n`;
    }
    text += `\n🌐 Page: ${page}\n🕐 Time: ${timestamp}`;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
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

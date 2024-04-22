import "dotenv/config";
import { Bot, session, Api, GrammyError, HttpError } from "grammy";
import axios from "axios";
const groupChatId = process.env.GROUP_CHAT_ID;
import { hydrateFiles } from "@grammyjs/files";
const bot = new Bot(process.env.BOT_API_KEY);
const api = new Api(process.env.BOT_API_KEY);
bot.api.config.use(hydrateFiles(bot.token));

export async function sendPDFFromYandexDisk() {
  try {
    const response = await axios.get(
      "https://cloud-api.yandex.net/v1/disk/resources?path=учебники",
      {
        headers: {
          Authorization: `OAuth ${process.env.YANDEX_DISK_TOKEN}`,
        },
      }
    );

    const items = response.data._embedded.items;

    const pdfItem = items.find((item) => item.mime_type === "application/pdf");
    if (!pdfItem) {
      console.log("На диске нет PDF файлов.");
      return;
    }

    const path = pdfItem.path;

    const response1 = await axios.get(
      `https://cloud-api.yandex.net/v1/disk/resources/download?path=${path}`,
      {
        headers: {
          Authorization: `OAuth ${process.env.YANDEX_DISK_TOKEN}`,
        },
      }
    );

    const filename = pdfItem.name.replace(".pdf", "");
    const filename2 = "Мой канал для самых маленьких - Малышата. Подписывайся!";
    const pdfUrl = response1.data.href;

    const message = `
    📝 *${filename}*

    🐣 [${filename2}](https://t.me/malichata)
    `;

    await bot.api.sendDocument(groupChatId, pdfUrl, {
      filename: pdfItem.name,
      caption: message,
      parse_mode: "Markdown",
    });

    await axios.post(
      `https://cloud-api.yandex.net/v1/disk/resources/move?from=${path}&path=Опубликовано/${path}`,

      {
        headers: {
          Authorization: `OAuth ${process.env.YANDEX_DISK_TOKEN}`,
        },
      }
    );

    console.log(
      `PDF файл ${path} успешно отправлен в группу через API Telegram и перемещен в папку "опубликовано" на Яндекс.Диске.`
    );
  } catch (error) {
    console.error("Ошибка при отправке PDF файла:", error);
  }
}

export async function sendPDFImmediatelyAndPeriodically() {
  try {
    await sendPDFFromYandexDisk();
  } catch (error) {
    console.error("Ошибка при отправке PDF файла:", error);
  }

  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  const isNightTime = currentHour >= 22 || currentHour < 8;

  if (!isNightTime) {
    setInterval(sendPDFFromYandexDisk, 60 * 60 * 1000); // Запускать каждый час
  } else {
    const nextMorning = new Date();
    nextMorning.setHours(6);
    nextMorning.setMinutes(0);
    nextMorning.setSeconds(0);
    const timeUntilMorning = nextMorning.getTime() - currentDate.getTime();
    setTimeout(() => {
      sendPDFImmediatelyAndPeriodically();
    }, timeUntilMorning);
  }
}

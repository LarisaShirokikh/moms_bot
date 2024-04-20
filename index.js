// import "dotenv/config";
// import axios from "axios";
// import { Bot, session, Api, GrammyError, HttpError, InputFile } from "grammy";
// import { hydrateFiles } from "@grammyjs/files";

// const groupChatId = process.env.GROUP_CHAT_ID;
// const bot = new Bot(process.env.BOT_API_KEY);
// const api = new Api(process.env.BOT_API_KEY);
// bot.api.config.use(hydrateFiles(bot.token));

// async function sendPDFFromYandexDisk() {
//   try {
//     const response = await axios.get(
//       "https://cloud-api.yandex.net/v1/disk/resources?path=учебники",
//       {
//         headers: {
//           Authorization: `OAuth ${process.env.YANDEX_DISK_TOKEN}`,
//         },
//       }
//     );

//     const items = response.data._embedded.items;

//     const pdfItem = items.find((item) => item.mime_type === "application/pdf");
//     if (!pdfItem) {
//       console.log("На диске нет PDF файлов.");
//       return;
//     }

//     const path = pdfItem.path;

//     const response1 = await axios.get(
//       `https://cloud-api.yandex.net/v1/disk/resources/download?path=${path}`,
//       {
//         headers: {
//           Authorization: `OAuth ${process.env.YANDEX_DISK_TOKEN}`,
//         },
//       }
//     );
// console.log(`PDF файл .`, response1);
//     const filename = pdfItem.name.replace(".pdf", "");
//     const filename2 = "Мой канал для самых маленьких - Малышата. Подписывайся!";
//     const pdfUrl = response1.data.href;

//     const message = `
//     📝 *${filename}*

//     🐣 [${filename2}](https://t.me/malichata)
//     `;

//     await bot.api.sendDocument(groupChatId, pdfUrl, {
//       filename: pdfItem.name,
//       caption: message,
//       parse_mode: "Markdown",
//     });

//     await axios.post(
//       `https://cloud-api.yandex.net/v1/disk/resources/move?from=${path}&path=Опубликовано`,

//       {
//         headers: {
//           Authorization: `OAuth ${process.env.YANDEX_DISK_TOKEN}`,
//         },
//       }
//     );

//     console.log(
//       `PDF файл ${path} успешно отправлен в группу через API Telegram и перемещен в папку "опубликовано" на Яндекс.Диске.`
//     );
//   } catch (error) {
//     console.error("Ошибка при отправке PDF файла:", error);
//   }
// }
// async function sendPDFImmediatelyAndPeriodically() {
//   try {
//     await sendPDFFromYandexDisk();
//   } catch (error) {
//     console.error("Ошибка при отправке PDF файла:", error);
//   }

//   // Получение текущего времени
//   const currentDate = new Date();
//   const currentHour = currentDate.getHours();

//   // Проверка, находится ли текущее время в ночном диапазоне (например, с 23:00 до 06:00)
//   const isNightTime = currentHour >= 22 || currentHour < 8;

//   // Если текущее время не в ночном диапазоне, повторная отправка через час
//   if (!isNightTime) {
//     setInterval(sendPDFFromYandexDisk, 60 * 60 * 1000); // Запускать каждый час
//   } else {
//     // Если ночное время, повторная отправка через час после завершения ночного диапазона
//     const nextMorning = new Date();
//     nextMorning.setHours(6); // Установка времени на 6:00 утра следующего дня
//     nextMorning.setMinutes(0);
//     nextMorning.setSeconds(0);
//     const timeUntilMorning = nextMorning.getTime() - currentDate.getTime();
//     setTimeout(() => {
//       sendPDFImmediatelyAndPeriodically();
//     }, timeUntilMorning);
//   }
// }

// bot.command("start", async (ctx) => {
//   try {
//     await sendPDFFromYandexDisk();
//     await ctx.reply("PDF файлы успешно отправлены в группу.", ctx.response);
//   } catch (error) {
//     console.error("Ошибка при отправке документов:", error);
//   }
// });

// bot.catch((err) => {
//   const ctx = err.ctx;
//   console.error(`Какая то ошибка ${ctx.update.update_id}:`);
//   const e = err.error;

//   if (e instanceof GrammyError) {
//     console.error("Error in request:", e.description);
//   } else if (e instanceof HttpError) {
//     console.error("Could not connect Telegramm", e);
//   } else {
//     console.error("Unknown error:", e);
//   }
// });

// bot.use(session());

// bot.start();
import "dotenv/config";
import axios from "axios";
import { Bot, session, Api, GrammyError, HttpError, InputFile } from "grammy";
import { hydrateFiles } from "@grammyjs/files";

const groupChatId = process.env.GROUP_CHAT_ID;
const bot = new Bot(process.env.BOT_API_KEY, {
  polling: {
    interval: 300,
    autoStart: true,
  },
});
const api = new Api(process.env.BOT_API_KEY);
bot.api.config.use(hydrateFiles(bot.token));

async function sendPDFFromYandexDisk() {
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
      parse_mode: "Markdown", // Parse the caption as Markdown
    });

    console.log("PDF файл успешно отправлен в группу через API Telegram.");

    await axios.post(
      `https://cloud-api.yandex.net/v1/disk/resources/move?from=${path}&path=Опубликовано`,
      {
        headers: {
          Authorization: `OAuth ${process.env.YANDEX_DISK_TOKEN}`,
        },
      }
    );

    console.log(
      `PDF файл ${path} успешно отправлен в группу через API Telegram и удален с Yandex Disk.`
    );
  } catch (error) {
    console.error("Ошибка при отправке PDF файла:", error);
  }
}

async function sendPDFImmediatelyAndPeriodically() {
  try {
    await sendPDFFromYandexDisk();
  } catch (error) {
    console.error("Ошибка при отправке PDF файла:", error);
  }

  // Получение текущего времени
  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  // Проверка, находится ли текущее время в ночном диапазоне (например, с 23:00 до 06:00)
  const isNightTime = currentHour >= 22 || currentHour < 8;

  // Если текущее время не в ночном диапазоне, повторная отправка через час
  if (!isNightTime) {
    setInterval(sendPDFFromYandexDisk, 60 * 60 * 1000); // Запускать каждый час
  } else {
    // Если ночное время, повторная отправка через час после завершения ночного диапазона
    const nextMorning = new Date();
    nextMorning.setHours(6); // Установка времени на 6:00 утра следующего дня
    nextMorning.setMinutes(0);
    nextMorning.setSeconds(0);
    const timeUntilMorning = nextMorning.getTime() - currentDate.getTime();
    setTimeout(() => {
      sendPDFImmediatelyAndPeriodically();
    }, timeUntilMorning);
  }
}

bot.command("start", async (ctx) => {
  try {
    await sendPDFFromYandexDisk();
    await ctx.reply("PDF файл успешно отправлен в группу.", ctx.response);
  } catch (error) {
    console.error("Ошибка при отправке документа:", error);
  }
});

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Какая то ошибка ${ctx.update.update_id}:`);
  const e = err.error;

  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not connect Telegramm", e);
  } else {
    console.error("Unknown error:", e);
  }
});

bot.use(session());

bot.start();

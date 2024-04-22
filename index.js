import "dotenv/config";
import pkg from "grammy";
const { Bot, session, Api, GrammyError, HttpError, InlineKeyboard } =
  pkg;
import { hydrateFiles } from "@grammyjs/files";
import { sendPDFImmediatelyAndPeriodically } from "./lib/yandex_disk.js";
const bot = new Bot(process.env.BOT_API_KEY);
const api = new Api(process.env.BOT_API_KEY);
const inlineKeyboard = new InlineKeyboard();
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { handleDocument } from "./server/api.js";

bot.api.config.use(hydrateFiles(process.env.BOT_API_KEY));

// bot.command("start", async (ctx) => {
//   try {
//     await sendPDFImmediatelyAndPeriodically();
//     await ctx.reply("PDF файлы успешно отправлены в группу.", ctx.response);
//   } catch (error) {
//     console.error("Ошибка при отправке документов:", error);
//   }
// });

bot.api.setMyCommands([
  { command: "start", description: "Запуск бота" },
  { command: "upload_file", description: "Загрузить файл" },
  { command: "enable_autoposting", description: "Включить автопостинг" },
]);

bot.command(["start", "upload_file", "enable_autoposting"], async (ctx) => {
  try {
    
    await ctx.reply("Выберите действие:");
  } catch (error) {
    console.error("Ошибка при отправке документов:", error);
  }
});

bot.on("message:document", async (ctx) => {
  const file = await ctx.getFile();
  const pathFile = await file.download();
   console.log("File saved at ", pathFile);
   console.log("File  at ", file);
   handleDocument(ctx, file, pathFile, __dirname);
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

import fs from "fs";
import pool from "./db.js";
import pkg from "grammy";
const { Bot, session, Api, GrammyError, HttpError, InlineKeyboard } = pkg;
const api = new Api(process.env.BOT_API_KEY);
import  path  from "path";
import { hydrateFiles } from "@grammyjs/files";

export async function handleDocument(ctx, file, pathFile, __dirname) {
  try {
    // Получаем информацию о файле
    const fileId = ctx.message.document.file_id;
    const fileUniqueId = ctx.message.document.file_unique_id;
    const fileName = ctx.message.document.file_name;
    console.log("контекст", file);
    const uploadPath = path.join(__dirname, "uploads", fileName);

    // Создаем поток для записи файла
    const writeStream = fs.createWriteStream(uploadPath);

    await file.download().then((stream) => {
      stream.pipe(writeStream);
    });

    const client = await pool.connect();
    await client.query(
      "INSERT INTO ant_ticher (title, file_location) VALUES ($1, $2)",
      [fileName, uploadPath]
    );
    client.release();

    // Отправляем пользователю сообщение об успешном сохранении файла
    await ctx.reply(`Файл ${fileName} успешно сохранен.`);
  } catch (error) {
    console.error("Ошибка при сохранении файла:", error);
    await ctx.reply("Произошла ошибка при сохранении файла.");
  }
}

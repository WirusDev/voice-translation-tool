import { exec } from "child_process";
import { promises as fsPromises } from "fs";
import axios from "axios";
import dotenv from "dotenv";
import { Telegraf } from "telegraf";
import { createWriteStream } from "fs";
import { promisify } from "util";
import { Message } from "telegraf/typings/core/types/typegram";

dotenv.config();

const execPromise = promisify(exec);
const unlink = fsPromises.unlink;

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN!);
const deeplApiKey = process.env.DEEPL_API_KEY;

bot.on("message", async (ctx) => {
  try {
    let fileLink;
    let fileName;

    const message = ctx.message as Message.AudioMessage | Message.VoiceMessage;

    // Check if the message contains audio or voice
    if ("voice" in message) {
      fileLink = await ctx.telegram.getFileLink(message.voice.file_id);
      fileName = message.voice.file_id;
    } else if ("audio" in message) {
      fileLink = await ctx.telegram.getFileLink(message.audio.file_id);
      fileName = message.audio.file_id;
    } else {
      ctx.reply("Пожалуйста, отправьте аудиофайл или голосовое сообщение.");
      return;
    }

    console.log("File link:", fileLink.href);

    const m4aPath = `./temp/${fileName}.m4a`;
    const wavPath = `./temp/${fileName}.wav`;

    // Download the audio file
    const response = await axios({
      url: fileLink.href,
      responseType: "stream",
    });
    const writer = createWriteStream(m4aPath);
    response.data.pipe(writer);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    console.log("Downloaded and saved audio file as M4A");

    // Convert M4A to WAV using FFmpeg
    await execPromise(`ffmpeg -i ${m4aPath} ${wavPath}`);
    console.log("Converted M4A to WAV");

    // Recognize speech using Whisper
    const { text: recognizedText, detected_language: detectedLanguage } =
      await recognizeSpeechWithWhisper(wavPath);
    console.log("Recognized text:", recognizedText);
    console.log("Detected language:", detectedLanguage);

    // Translate text using DeepL
    const translatedText = await translateTextWithDeepL(recognizedText);
    console.log("Translated text:", translatedText);

    // Send original and translated text to the user in one message
    ctx.replyWithMarkdown(
      `*Оригинальный текст:*\n${recognizedText}\n\n*Переведенный текст:*\n${translatedText}`
    );

    // Cleanup temporary files
    await unlink(m4aPath);
    await unlink(wavPath);
    console.log("Cleaned up temporary files");
  } catch (error) {
    console.error(error);
    ctx.reply("Произошла ошибка при обработке вашего аудиофайла.");
  }
});

async function recognizeSpeechWithWhisper(
  filePath: string
): Promise<{ text: string; detected_language: string }> {
  const { execSync } = require("child_process");
  execSync(`python3 whisper_wrapper.py ${filePath}`);
  const outputPath = filePath.replace(".wav", ".json");
  const result = JSON.parse(require("fs").readFileSync(outputPath, "utf-8"));
  return { text: result.text, detected_language: result.language };
}

async function translateTextWithDeepL(text: string): Promise<string> {
  const response = await axios.post(
    "https://api-free.deepl.com/v2/translate",
    null,
    {
      params: {
        auth_key: deeplApiKey,
        text: text,
        target_lang: "RU",
      },
    }
  );
  return response.data.translations[0].text;
}

bot.launch();

console.log("Bot is running...");

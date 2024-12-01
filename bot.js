import { exec } from 'child_process';
import { config } from "dotenv";
import TelegramBot from 'node-telegram-bot-api';
import { checkAuth } from './checkAuth.js';
import { COMMANDS } from './commands.js';

config()

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

// Command to execute shell scripts
bot.onText(COMMANDS.exec, async (msg, match) => {
    const { id: chatId } = msg.chat;
    const { id: userId } = msg.from;
    const username = msg.from.username;
    const isAuthorized = await checkAuth(userId, username, chatId, bot);
    if (!isAuthorized) {
        return;
    }

    const command = match[1]; // Get the shell command from the message

    // Execute the shell command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            bot.sendMessage(chatId, `Error: ${error.message}`);
            return;
        }
        if (stderr) {
            bot.sendMessage(chatId, `Stderr: ${stderr}`);
            return;
        }
        bot.sendMessage(chatId, `Output: ${stdout}`)
    });
});


bot.onText(COMMANDS.chackNg, (msg) => {
    const chatId = msg.chat.id
    console.log("sending mess")
    exec('./check_ngrok.fish', (error, stdout, stderr) => {
        if (error) {
            bot.sendMessage(chatId, `Error: ${error.message}`);
            return;
        }
        if (stderr) {
            bot.sendMessage(chatId, `Stderr: ${stderr}`);
            return;
        }
        
        bot.sendMessage(chatId, `Output: ${stdout}`)
    })
       
    const filePath = "./NgrokTCPLink.txt";
    fs.readFile(filePath, "utf-8", (err, data) => {
        console.log('checking file');
        if (err) {
            console.error(err);
            return bot.sendMessage(chatId, "Error reading the file. Make sure the file exists and is accessible.");
        }

        bot.sendMessage(chatId, `Output: ${data}`);
    });
});

// Default message for unrecognized commands
bot.on(COMMANDS.message, async (msg) => {
    const chatId = msg.chat.id;
    const userId = msg.from.id
    const username = msg.from.username
    const isAuthorized = await checkAuth(userId, username, chatId, bot);
    if (!isAuthorized) {
        return;
    }
    if (!msg.text.startsWith('/exec'||'/checkNg')) {
        bot.sendMessage(msg.chat.id, 'Use /exec <command> to execute shell scripts.');
    }
});


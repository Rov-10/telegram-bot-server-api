import { exec } from 'child_process';
import { config } from "dotenv";
import TelegramBot from 'node-telegram-bot-api';
import { checkAuth } from './checkAuth.js';
import { checkAdmin } from './checkAdmin.js';
import { COMMANDS } from './commands.js';
import { readFile } from 'fs';

config();

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

// Middleware to check authorization
bot.on('message', async (msg) => {
    const { id: chatId } = msg.chat;
    const { id: userId } = msg.from;
    const username = msg.from.username;

    const isAuthorized = await checkAuth(userId, username, chatId, bot);
    if (!isAuthorized) {
        bot.sendMessage(chatId, "Unauthorized access.");
        return;
    }

    handleMessage(msg);
});

// Function to handle commands and messages
const handleMessage = (msg) => {
    const text = msg.text || '';
    const { id: chatId } = msg.chat;

    // Match specific commands using regex
    if (COMMANDS.exec.test(text)) {
        handleExecCommand(msg, text);
    } else if (COMMANDS.checkng.test(text)) {
        handleCheckNgCommand(chatId);
    } else if (COMMANDS.checkserver.test(text)) {
        handleCheckServerCommand(chatId);
    } else if (COMMANDS.startserver.test(text)) {
        handleStartServerCommand(msg);
    } else {
        bot.sendMessage(chatId, 'Unrecognized command.');
    }
};


// Handler for executing shell scripts
const handleExecCommand = async(msg, text) => {
    const { id: chatId } = msg.chat;
    const { id: userId } = msg.from;
    const username = msg.from.username;

    const isAdmin = await checkAdmin(userId, username, chatId, bot);
    if (!isAdmin) {
        bot.sendMessage(chatId, "Access denied.");
        return;
    }

    // Extract the command after the /exec keyword
    const command = text.replace(COMMANDS.exec, '');
    console.log(command)
    // Validate the command
    if (!command) {
        bot.sendMessage(chatId, "Error: No command provided. Use /exec <command>.");
        return;
    }

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
        bot.sendMessage(chatId, `Output: ${stdout}`);
    });
};


// Handler for checking ngrok
const handleCheckNgCommand = (chatId) => {
    exec('scripts/check_ngrok.sh', (error, stdout, stderr) => {
        if (error) {
            bot.sendMessage(chatId, `Error: ${error.message}`);
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            bot.sendMessage(chatId, `Stderr: ${stderr}`);
            return;
        }

        // bot.sendMessage(chatId, `Script Output: ${stdout}`);

        // Read and send file content
        const filePath = "./NgrokTCPLink.txt";
        readFile(filePath, "utf-8", (err, data) => {
            if (err) {
                console.error(err);
                return bot.sendMessage(chatId, "Error reading the file. Make sure the file exists and is accessible.");
            }

            bot.sendMessage(chatId, `${data}`);
        });
    });
};

const handleCheckServerCommand = (chatId) => {
    exec('scripts/check_server.sh', (error, stdout, stderr) => {
        if (error) {
            bot.sendMessage(chatId, `Error: ${error.message}`);
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            bot.sendMessage(chatId, `Stderr: ${stderr}`);
            return;
        }
        bot.sendMessage(chatId, `Output: ${stdout}`)
        
    })
}

const handleStartServerCommand = async(msg) => {
    const { id: chatId } = msg.chat;
    const { id: userId } = msg.from;
    const username = msg.from.username;

    const isAdmin = await checkAdmin(userId, username, chatId, bot);
    if (!isAdmin) {
        bot.sendMessage(chatId, "Access denied.");
        return;
    }
    exec('scripts/start_server.sh', (error, stdout, stderr) => {
        if (error) {
            bot.sendMessage(chatId, `Error: ${error.message}`);
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            bot.sendMessage(chatId, `Stderr: ${stderr}`);
            return;
        }
        bot.sendMessage(chatId, `Output: ${stdout}`)
        
    })
}
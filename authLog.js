import { authUserArray } from './authUser.js'; // Add the .js extension
import { appendFile } from 'fs/promises';

export const checkAuth = async (userId, chatId, username, bot) => {
    if (!authUserArray.includes(userId)) {
        const logData = {
            username: username.toString(),
            userId: userId.toString(),
            chatId: chatId.toString(),
            time: new Date().toISOString(),
        };

        // Log to console
        console.log(JSON.stringify(logData, null, 2));

        // Append JSON log to file
        try {
            await appendFile('unauthorized_access.log', JSON.stringify(logData) + '\n');
        } catch (err) {
            console.error('Failed to write to log file:', err);
        }

        // Send unauthorized message
        await bot.sendMessage(chatId, 'You are not authorized to use this bot.');
        return false;
    }

    return true;
};

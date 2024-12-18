import fs from 'fs/promises';
import { logData } from './log.js';

export const checkAuth = async (userId, username, chatId, bot) => {
    try {
        // Read and parse the JSON file
        const data = await fs.readFile('./authData.json', 'utf-8');
        const { authUsers } = JSON.parse(data);

        // Check if the userId exists in the authUsers array
        if (authUsers.includes(userId)) return true;

        // Log unauthorized access
        await logData(bot, { userId, username }, chatId);
        return false;
    } catch (error) {
        console.error('Error reading or parsing authData.json:', error);
        return false; // Deny access in case of any error
    }
};

import { appendFile } from 'fs/promises';

const logData = async (bot, user, chatId) => {
    const { userId, username } = user;

    const data = {
        username: username.toString(),
        userId: userId.toString(),
        chatId: chatId.toString(),
        time: new Date().toISOString(),
    };
    
    console.log(JSON.stringify(data, null, 2));

    try {
        await appendFile('unauthorized_access.log', JSON.stringify(data) + '\n');
    } catch (err) {
        console.error('Failed to write to log file:', err);
    }

    // await bot.sendMessage(chatId, 'You are not authorized to use this bot.');

    
}

export { logData }
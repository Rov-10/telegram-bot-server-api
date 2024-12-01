import { AUTHORIZED_USERS } from './authUser.js';
import { logData } from './log.js';

export const checkAuth = async (userId, username, chatId, bot) => {
    if (AUTHORIZED_USERS.includes(userId)) return true;
    logData(bot, { userId, username }, chatId)
    return false;
};

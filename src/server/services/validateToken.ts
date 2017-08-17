const jwt = require('jsonwebtoken'); // аутентификация  по JWT для hhtp
const jwtsecret = 'sarafanprettygoodsecurekey'; // ключ для подписи JWT

/**
 * Валидация JWT токена
 * @param {String} jwtToken jwt токен, полученный в хэдере запроса
 * @returns {Boolean} результат валидации токена
 */
export async function validateToken(headerToken: string) {
    if (headerToken === undefined) {
        return false;
    } else {
        const verify = new Promise((resolve) => {
            jwt.verify(headerToken.replace('JWT ', ''), jwtsecret, (err, decoded) => {
                if (decoded) {
                    return resolve(true);
                }
                return resolve(false);
            });
        });
        return await verify;
    }
};

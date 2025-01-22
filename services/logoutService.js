require('dotenv').config();
const jwt = require('jsonwebtoken');
const redis = require('redis');
const logger = require('../logger');
const client = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
});

const JWT_SECRET = process.env.JWT_SECRET;

async function logoutUser(userId, token) {
    try {
        // Verificar el token JWT
        const decoded = jwt.verify(token, JWT_SECRET);

        // Comprobar si el userId del token coincide con el userId proporcionado
        if (decoded.id !== userId) { // Asegúrate de que el campo 'id' es el correcto
            throw new Error('User ID does not match the token');
        }

        // Eliminar el token de Redis utilizando el userId como clave
        return new Promise((resolve, reject) => {
            client.del(userId, (err, response) => {
                if (err) {
                    reject(new Error('Error deleting token from Redis'));
                }
                if (response === 1) {
                    const message = 'Token deleted successfully';
                    logger.info(message);
                    resolve(message);
                } else {
                    const message = 'Token not found in Redis';
                    logger.info(message);
                    resolve(message);
                }
            });
        });
    } catch (error) {
        logger.error(`Error logging out user: ${error.message}`);
        throw error;
    }
}

module.exports = {
    logoutUser
};

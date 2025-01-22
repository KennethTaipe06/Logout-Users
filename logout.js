const jwt = require('jsonwebtoken');
const redis = require('redis');
const client = redis.createClient();

const JWT_SECRET = 'your_jwt_secret'; // Cambia esto por tu secreto JWT

async function logoutUser(userId, token) {
    try {
        // Verificar el token JWT
        const decoded = jwt.verify(token, JWT_SECRET);

        // Comprobar si el userId del token coincide con el userId proporcionado
        if (decoded.userId !== userId) {
            throw new Error('User ID does not match token');
        }

        // Eliminar el token de Redis
        client.del(token, (err, response) => {
            if (err) {
                throw new Error('Error deleting token from Redis');
            }
            if (response === 1) {
                console.log('Token deleted successfully');
            } else {
                console.log('Token not found in Redis');
            }
        });
    } catch (error) {
        console.error('Error logging out user:', error.message);
    }
}

module.exports = logoutUser;

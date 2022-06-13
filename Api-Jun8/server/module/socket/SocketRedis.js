const redis = require('redis');

const redisClient = redis.createClient(process.env.REDIS_URL);
const APP_USER_ROOM = 'APP_USER_ROOM';

exports.addUser = async userId => new Promise(resolve => redisClient.sadd(APP_USER_ROOM, userId, resolve));

exports.removeUser = async userId => new Promise(resolve => redisClient.srem(APP_USER_ROOM, userId, resolve));

exports.getSocketsFromUserId = async userId => new Promise(resolve => redisClient.smembers(userId, (err, members) => resolve(err ? [] : members)));

exports.removeUserSocketId = async (userId, socketId) => new Promise(resolve => redisClient.srem(userId, socketId, resolve));

exports.addUserSocketId = async (userId, socketId) => new Promise(resolve => redisClient.sadd(userId, socketId, resolve));

exports.hasUser = async userId => new Promise(resolve => redisClient.sismember(APP_USER_ROOM, userId, (err, data) => resolve(!err && data)));

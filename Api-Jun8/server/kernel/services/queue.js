const Queue = require('bee-queue');

// shttps:// github.com/bee-queue/bee-queue#settings
exports.create = queueName => (new Queue(queueName, {
  prefix: process.env.QUEUE_PREFIX || 'queue',
  stallInterval: 5000,
  nearTermWindow: 1200000,
  delayedDebounce: 1000,
  redis: {
    url: process.env.REDIS_URL
  },
  isWorker: true,
  getEvents: true,
  sendEvents: true,
  storeJobs: true,
  ensureScripts: true,
  activateDelayedJobs: false,
  removeOnSuccess: true,
  removeOnFailure: true
}));

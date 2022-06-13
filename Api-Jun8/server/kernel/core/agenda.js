const Agenda = require('agenda');
// const memwatch = require('memwatch-next');

const agenda = new Agenda({
  name: process.env.AGENDA_COLLECTION_NAME,
  maxConcurrency: process.env.AGENDA_MAX_CONCURRENCY,
  db: {
    address: process.env.MONGO_URI
  }
});

// handle events emitted
// agenda.on('start', job => console.info(`job "${job.attrs.name}" started`));
agenda.on('complete', () => {
  // console.info(`job "${job.attrs.name}" completed`);
  // manually handle garbage collection
  // <https://github.com/rschmukler/agenda/issues/129#issuecomment-108057837>
  // memwatch.gc();
});
// agenda.on('success', job => console.info(`job "${job.attrs.name}" succeeded`));
agenda.on('fail', (err, job) => {
  // TODO - should move to log
  console.error(`job "${job.attrs.name}" failed: ${err.message}`, {
    extra: {
      job
    }
  });
});

module.exports = agenda;

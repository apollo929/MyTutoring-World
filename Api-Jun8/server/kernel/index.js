const http = require('http');
const _ = require('lodash');
const mongoose = require('mongoose');
const Helper = require('./helpers');
const Mailer = require('./services/mailer');
const Logger = require('./services/logger');
const Queue = require('./services/queue');
const TemplateEngine = require('./services/template-engine');
const ResponseMiddleware = require('./middlewares/response');
const RequestMiddleware = require('./middlewares/request');

class Kernel {
  constructor(config) {
    this.config = config || {};
    this._modelSchemas = {};
    this._mongoosePlugins = {};
    this._routes = [];
    this._agendaJobs = [];
    this._services = {};
    this.httpServer = null;
    this.db = {};
    this.middleware = {
      Response: ResponseMiddleware,
      Request: RequestMiddleware
    };
  }

  addProp(key, val) {
    this[key] = val;
  }

  startHttpServer() {
    this.httpServer = http.createServer(this.app);
    this.httpServer.listen(process.env.PORT, null, () => {
      // TODO - load env from config
      console.log(
        'Express server listening on %d, in %s mode',
        process.env.PORT,
        process.env.NODE_ENV || 'development'
      );
    });
  }

  loadModule(module) {
    if (module.config) {
      this.config = _.defaults(this.config, module.config);
    }

    if (module.core) {
      module.core(this);
    }

    if (module.model) {
      Object.keys(module.model).forEach(modelName => {
        this._modelSchemas[modelName] = module.model[modelName];
      });
    }

    if (module.mongoosePlugin) {
      Object.keys(module.mongoosePlugin).forEach(modelName => {
        if (!this._mongoosePlugins[modelName]) {
          this._mongoosePlugins[modelName] = [];
        }

        this._mongoosePlugins[modelName].push(module.mongoosePlugin[modelName]);
      });
    }

    if (module.middleware) {
      Object.keys(module.middleware).forEach(name => {
        this.middleware[name] = module.middleware[name];
      });
    }

    if (module.router) {
      this._routes.push(module.router);
    }

    if (module.agendaJobs) {
      /**
       * https://github.com/agenda/agenda
       * job format
       * [
       *   {
       *     name: '...',
       *     interval: '3 minutes',
       *     job: function(job, done) {
       *       ...
       *     }
       *   }
       * ]
       */
      this._agendaJobs = this._agendaJobs.concat(module.agendaJobs);
    }

    if (module.services) {
      Object.keys(module.services).forEach(name => {
        this._services[name] = module.services[name];
      });
    }
  }

  _modelLoader() {
    const db = {};
    Object.keys(this._modelSchemas).forEach(name => {
      const schema =
        typeof this._modelSchemas[name] === 'function' ? this._modelSchemas[name]() : this._modelSchemas[name];

      if (schema instanceof mongoose.Schema) {
        if (this._mongoosePlugins[name] && Array.isArray(this._mongoosePlugins[name])) {
          this._mongoosePlugins[name].forEach(pluginFunctionFactory => schema.plugin(pluginFunctionFactory));
        }

        // TODO: maybe this should be done in the mongoose plugin
        // for now we just assume that mongoConnection is always present
        db[name] = mongoose.model(name, schema);
      } else {
        // assuming the only other type of model is group which already return a model
        db[name] = schema;
      }
    });

    this.db = db;
  }

  compose() {
    this._modelLoader();

    global.AppConfig = this.config;
    global.Helper = Helper;
    global.Service = Object.assign(this._services, {
      // do not allow to override system module
      Mailer,
      Logger,
      Queue,
      TemplateEngine
    });
    global.AppSchema = {
      event: require('./schemas/event'),
      person: require('./schemas/person'),
      thing: require('./schemas/thing'),
      timestamp: require('./schemas/timestamp')
    };
    global.DB = this.db;
    global.Middleware = this.middleware;
    global.PopulateResponse = require('./util/populate-response');
    global.Log = require('./util/log');
    this._routes.forEach(route => route(this.app));

    // error handler
    this.app.use(async (err, req, res, next) => {
      const httpCode = err.httpCode || 400;
      const code = err.code || httpCode;
      const data = err.data || null;
      const message = err.message || 'An error occurred, please try again!';

      // TODO - check error code for handler here
      await Service.Logger.create({ req, error: err });

      res.status(httpCode).send({
        code,
        message,
        data
      });

      next();
    });

    if (this._agendaJobs.length) {
      const agenda = require('./core/agenda');
      this._agendaJobs.forEach(job => agenda.define(job.name, job.job));
      agenda.on('ready', () => {
        console.info('agenda ready');

        this._agendaJobs.forEach(job => agenda.every(job.interval, job.name));
        agenda.start();
      });
    }
  }
}

function kernelFactory(config) {
  const kernel = new Kernel(config);

  kernel.loadModule(require('./core/express'));
  kernel.loadModule(require('./core/mongoose'));
  kernel.loadModule(require('./models/user'));
  kernel.loadModule(require('./models/log'));

  return kernel;
}

module.exports = kernelFactory;

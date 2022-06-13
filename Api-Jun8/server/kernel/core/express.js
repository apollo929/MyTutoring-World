/* eslint no-param-reassign: 0 */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const methodOverride = require('method-override');
const morgan = require('morgan');
const SwigEngine = require('swig').Swig;
const info = require('../../../package.json');
const nconf = require('nconf');

const swig = new SwigEngine();

exports.name = 'kernel-app';

exports.config = {
  publicPath: path.resolve('./public')
};

// Expose app
exports.core = kernel => {
  kernel.addProp('app', express());
  kernel.app.engine('swig', swig.renderFile);
  kernel.app.engine('html', swig.renderFile);
  kernel.app.set('view engine', 'swig');
  kernel.app.set('views', path.join(__dirname, '..', '..', 'views'));
  kernel.app.set('view cache', false);
  kernel.app.disable('x-powered-by');
  kernel.app.locals.baseUrl = nconf.get('baseUrl');

  const whitelist = [nconf.get('userWebUrl'), nconf.get('adminURL')];
  const corsOptionsDelegate = function (req, callback) {
    if (whitelist.indexOf(req.header('Origin')) !== -1 || req.get('host') == nconf.get('host')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  };
  process.env.ALLOW_CORS && kernel.app.use(cors(corsOptionsDelegate));
  //process.env.ALLOW_CORS && kernel.app.use(cors());
  kernel.app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );
  kernel.app.use(bodyParser.json());
  kernel.app.use(methodOverride());
  if (process.env.NODE_ENV === 'production') {
    // log only 4xx and 5xx responses to console
    kernel.app.use(
      morgan('dev', {
        skip(req, res) {
          return res.statusCode < 400;
        }
      })
    );
  } else {
    kernel.app.use(morgan('dev'));
  }

  kernel.app.use(express.static(this.config.publicPath));

  kernel.app.get('/api-author', (req, res) => {
    res.status(200).send({
      author: 'Tuong Tran <tuong.tran@outlook.com>',
      appName: info.name,
      version: info.version
    });
  });
};

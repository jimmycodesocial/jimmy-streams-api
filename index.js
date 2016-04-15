'use strict';

/* global require */

let config = require('config');
let app = require('express')();
let bodyParser = require('body-parser');
let cors = require('cors');
let expressValidator = require('express-validator');
let logger = config.get('app.logger');
let routes = require('./app/routes');

app.use(cors(config.get('app.cors')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());

// Expose API
app.use('/api/', routes);

// Start listening on configured port
let server = app.listen(config.get('app.port'), () => {
  let addr = server.address();
  let bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;

  logger.info('Listening on ' + bind);
  logger.info("Started application on mode " + app.get("env"));
});

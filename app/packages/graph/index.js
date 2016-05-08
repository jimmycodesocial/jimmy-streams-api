'use strict';
/* global module, exports, require */

const Vertex = require('./models/Vertex');
const Schema = require('./models/Schema');
const VertexCollection = require('./models/VertexCollection');


const GraphManager = require('./models/GraphManager');
const async = require('async');

let models = {};

/**
 * Creates a class Model inherit from Vertex
 *
 * @param className
 * @param schema
 * @param superClass
 * @param connection
 * @returns {{new(*): {isValid: (function(*=): Boolean), delete: (function(*=)), save: (function(*): *), data, data}, new(*=, *=, *=, *=): {isValid: (function(*=): Boolean), delete: (function(*=)), save: (function(*): *), data, data}}|*}
 * @constructor
 */
exports.Vertex = function(className, schema, superClass, connection) {
  superClass = superClass || 'V';
  connection = connection || 'default';
  
  let identifier = superClass + '_' + className;

  if (models[identifier] === undefined) {

    models[identifier] = {
      'classObject': class extends Vertex {
        constructor(data) {
          super(className, schema, superClass, connection);
          this.data = data;
        }
      },
      'className': className,
      'connection': connection,
      'superClass': superClass,
      'schema': schema
    };

    models[identifier]['classObject']['collection'] = new VertexCollection(className, schema, connection);
  }
  
  return models[identifier].classObject;
};

/**
 * Create a new instance of Schema class
 *
 * @param structure
 * @returns {Schema}
 * @constructor
 */
exports.Schema = function(structure){
  return new Schema(structure);
};

/**
 * Exports Graph Manager
 */
exports.gm = GraphManager;

/**
 * Connect to databse in config. Create or Update database schema if needed.
 * 
 * @param config
 * @param done
 */
exports.connect = function(config, done) {

  let boot_connections = [];

  for (let key in config.connections) {
    if (config.connections.hasOwnProperty(key)) {
      boot_connections.push((cb) => {
        let gm = GraphManager.getInstance(key);
        gm.createDatabaseIfNotExist(cb)
      });
    }
  }

  async.series(boot_connections, (err) => {
    if (err) return done(err);
    
    // Create or Update every model in Graph
    let tasks = [];
    for (let key in models) {
      let item = models[key];

      tasks.push((cb) => {
        let gm = GraphManager.getInstance(item.connection);
        gm.createClassIfNotExist(item.className, item.superClass, (err) => {
          gm.syncClassProperties(item.className, item.schema, cb)
        });
        
      });
    }

    async.series(tasks, done);
  });
};
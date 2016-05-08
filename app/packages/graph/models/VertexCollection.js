'use strict';
/*globals require, exports*/

const GraphManager = require('./GraphManager');
const _ = require('lodash');

class VertexCollection {
  constructor (className, schema, connection) {
    this.conn = connection;
    this.gm = GraphManager.getInstance(this.conn);

    this.className = className;
    this.schema = schema;
  }

  /**
   * Updates or create a vertex on database
   * @param criteria
   * @param data
   * @param done
   */
  upsert(criteria, data, done) {
    this.gm.database.update(this.className).set(data).upsert(criteria).return('after @this').one()
        .then((record) => { done(null, this.inflate(record)); });
  }

  /**
   * Inflates the record to a Vertex object
   * @param record
   * @returns {*}
   */
  inflate (record) {
    if (record === undefined) {
      return record;
    }

    let vertex = {rid: record['@rid'].toString()};

    for(let propertyName in this.schema.structure) {
      vertex[propertyName] = record[propertyName];
    }

    return vertex;
  }

  /**
   * Create a new vertex in database
   * @param data
   * @param done
   * @returns {*}
   */
  create(data, done) {
    let errors = this.schema.validate(data);
    if(_.isEmpty(errors)) {

      this.gm.database.insert().into(this.className).set(data).one()
          .then((record) => done(null, this.inflate(record)));
    } else {
      // Return errors if schema is not valid
      return done(errors);
    }
  }

  /**
   * Delete vertex matching with criteria
   * @param criteria
   * @param done
   */
  delete(criteria, done) {
    this.gm.database.delete('VERTEX').from(this.className).where(criteria).one().then((count) => done(null, count));
  }

  /**
   * Returns first vertex matching with criteria
   * @param criteria
   * @param done
   */
  findOne(criteria, done) {
    this.gm.database.select().from(this.className).where(criteria).one().then((record) => done(null, this.inflate(record)))
  }

  /**
   * Create or update an edge
   * 
   * @param label
   * @param from
   * @param to
   * @param data
   * @param done
   */
  upsertEdge(label, from, to, data, done) {
    this.gm.database.select().from(label).where({in: to, out: from}).one().then((edge) => {
      if (edge === undefined) {
        this.createEdge(label, from, to, data, done)
      } else {
        this.gm.database.update(edge['@rid'].toString()).set(data).one().then((edge) => done(null, edge));
      }
    });
  }

  /**
   * Create an edge
   * 
   * @param label
   * @param from
   * @param to
   * @param data
   * @param done
   */
  createEdge(label, from, to, data, done) {
    this.gm.database.create('EDGE', label).set(data).from(from).to(to).one().then((edge) => done(null, edge));
  }

  /**
   * Delete edge
   * 
   * @param from
   * @param to
   * @param done
   */
  deleteEdge(from, to, done) {
    this.gm.database.delete('EDGE').from(from).to(to).scalar().then((count) => done(null, count));
  }

  /**
   * Execute query in database
   * 
   * @param query
   * @param params
   * @param done
   */
  query(query, params, done) {
    this.gm.database.query(query, {params: params}).then((results) => {
      // Todo: Inflate results
      done(null, results);
    });
  }
}

module.exports = VertexCollection;

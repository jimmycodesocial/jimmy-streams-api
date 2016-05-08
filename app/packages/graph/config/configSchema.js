'use strict';
/* global module */

const GraphConfigurationSchema = {
  "id": "/GraphConfiguration",
  "type": "object",
  "properties": {
    "connections": {
      "type": "object",
      "properties": {
        "type": "object",
        "properties": {
          "name": "string",
          "server": {
            "type": "object",
            "properties": {
              "host": "string",
              "port": "int",
              "username": "string",
              "password": "string",
              "servers": {
                "type": "array",
                "items": {
                  "type": "object",
                  "properties": {
                    "host": "string",
                    "port": "int"
                  }
                }
              }
            },
            "required": ["host"]
          },
          "database": {
            "type": "object",
            "properties": {
              "name": "string",
              "username": "string",
              "password": "string"
            },
            "required": ["name", "username", "password"]
          }
        },
        "required": ["server", "database"]
      }
    }
  },
  "required": ["connections"]
};

module.exports = GraphConfigurationSchema;

'use strict';

/* global module */

module.exports = {
  'name': {
    notEmpty: true,
    errorMessage: 'You should name the stream'
  },
  'class': {
    notEmpty: true,
    errorMessage: 'You should categorize the stream with a class or type'
  }
};

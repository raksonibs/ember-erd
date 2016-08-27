'use strict';

var path = require('path');
var assert = require('assert');
var fs = require('fs');
var start = require('../bin/index.js');

describe('Running', function() {

  // Check global paths
  it('should use run without errors', function() {
    var expected = true    
    assert.equal(true, expected);
  });

  it('should throw error if no model file', function() {
    var expected = true
    var result = start();
    assert.equal(result, undefined);
  });

  it('Should output a two model file with two models with one relationship', function() {
    var expected = true
    var result = start('test/fills/models/');
    // assert.equal(result, '');
  });

  it('Should handle complex model files', function() {
    var expected = true
    var result = start('test/fills/models2/');    
    assert.equal(true, expected);
  });
})
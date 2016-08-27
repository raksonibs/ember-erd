'use strict';

var path = require('path');
var assert = require('assert');
var findAll = require('../bin/index.js');

describe('Running', function() {

  // Check global paths
  // it('should use run without errors', function() {
  //   var expected = true    
  //   assert.equal(true, expected);
  // });

  // it('should throw error if no model file', function() {
  //   var expected = true
  //   var result = findAll();
  //   assert.equal(result, "ERROR. No such directory");
  // });

  it('Should output a two model file with two models with one relationship', function() {
    var expected = true
    var result = findAll('test/fills/models/'); 
    // assert.equal(result, '');
  });

  // it('Should handle complex model files', function() {
  //   var expected = true
  //   var result = findAll('test/fills/models2/');    
  //   assert.equal(true, expected);
  // });
})
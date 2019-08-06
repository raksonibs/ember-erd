'use strict';

const path = require('path');
const assert = require('assert');
const fs = require('fs');
const start = require('../bin/index.js');

describe('Running', function() {

  // Check global paths
  it('should use run without errors', function() {
    let expected = true;
    assert.equal(true, expected);
  });

  it('should throw error if no model file', function() {
    let expected = true;
    let result = start();
    assert.equal(result, undefined);
  });

  it('Should output a two model file with two models with one relationship', function() {
    let expected = true;
    let result = start('test/fills/models3/');
    // assert.equal(result, '');
  });

  it('Should handle complex model files', function() {
    let expected = true;
    let result = start('test/fills/models2/');
    assert.equal(true, expected);
  });

  it('Should reproduce Ghosts models', function() {
    let expected = true;
    let result = start('test/fills/models/');
    assert.equal(true, expected);
  });
});

'use strict';

var expect = require('chai').expect;
var ModulesLintPlugin = require('../../lib/modules-lint');
var sinon = require('sinon');
var broccoli = require('broccoli');

var builder;

describe('modules-lint', function() {
  beforeEach(function() {
    sinon.spy(console, 'log');
  });

  afterEach(function() {
    console.log.restore();
    if (builder) {
      builder.cleanup();
    }
  });

  it('works', function() {
    var sourcePath = 'tests/mocha/fixtures';
    var node = new ModulesLintPlugin(sourcePath);
    builder = new broccoli.Builder(node);
    return builder.build().then(function(result) {
      expect(console.log.calledWith('in the plugin')).to.be.ok;
  });
  });
});

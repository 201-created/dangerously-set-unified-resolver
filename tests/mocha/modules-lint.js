'use strict';

var expect = require('chai').expect;
var ModulesLintPlugin = require('../../lib/modules-lint');
var sinon = require('sinon');
var broccoli = require('broccoli');
var Fixturify = require('broccoli-fixturify');

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
    var desiredDirectory = {
      'foo.txt': 'foo.txt contents',
      'subdir': {
        'bar.txt': 'bar.txt contents'
      }
    };
    var tree = new Fixturify(desiredDirectory);
    var node = new ModulesLintPlugin(tree);

    builder = new broccoli.Builder(node);
    return builder.build().then(function(result) {
      expect(console.log.calledWith('in the plugin')).to.be.ok;
      expect(console.log.calledWith('foo.txt')).to.be.ok;
    });
  });
});

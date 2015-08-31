/* jshint node: true */
'use strict';

var VersionChecker = require('ember-cli-version-checker');

module.exports = {
  name: 'ember-resolver',

  included: function() {
    this._super.included.apply(this, arguments);

    var checker = new VersionChecker(this);
    var dep = checker.for('ember-cli', 'npm');

    if (!dep.satisfies('>= 2.0.0')) {
      this.monkeyPatchVendorFiles();
    }
  },

  monkeyPatchVendorFiles: function() {
    var filesToAppend = this.app.legacyFilesToAppend;
    var legacyResolverIndex = filesToAppend.indexOf(this.app.bowerDirectory + '/ember-resolver/dist/modules/ember-resolver.js');

    if (legacyResolverIndex > -1) {
      filesToAppend.splice(legacyResolverIndex, 1);
    }
  }
};
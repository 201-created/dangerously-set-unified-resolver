/* jshint loopfunc:true */
import { module, test } from 'qunit';
import Resolver from 'dangerously-set-unified-resolver/unified-resolver';
import DefaultConfig from 'dangerously-set-unified-resolver/ember-config';
import Ember from 'ember';

let modulePrefix = 'test-namespace';
const underscore = Ember.String.underscore;

module('ember-resolver/unified-resolver - fallback tests', {});

// The recording registry keeps track of all the moduleName/exports that
// it attempts to look up (through `has`, `get` or `getExport`)
class RecordingRegistry {
  constructor() {
    this._lookups = [];
  }

  get _uniqueLookups() {
    return Ember.A(this._lookups).uniq();
  }

  /*
   * not needed (yet?)
  get(moduleName) {
    this._lookups.push(moduleName);
    
    throw new Error('RecordingRegistry raises on all `get` calls');
  }
  */

  /*
   * not needed (yet?)
  getExport(moduleName, exportName = 'default') {
    let lookupName = moduleName;
    if (exportName !== 'default') {
      lookupName = lookupName + ':' + exportName;
    }
    this._lookups.push(lookupName);

    throw new Error('RecordingRegistry raises on all `getExport` calls');
  }
  */

  has(moduleName, exportName='default') {
    let lookupName = moduleName;
    if (exportName !== 'default') {
      lookupName = lookupName + ':' + exportName;
    }
    this._lookups.push(lookupName);
    return false;
  }
}

function expectResolutions(lookupName, orderedSearchPaths) {
  test(`resolve ${lookupName}`, function(assert) {
    assert.expect(2);

    let registry = new RecordingRegistry();

    let resolver = new Resolver({
      config: DefaultConfig,
      namespace: {modulePrefix},
      _moduleRegistry: registry
    });

    let resolved = resolver.resolve(lookupName);

    assert.ok(resolved === undefined, 'precond - resolves to undefined');
    assert.deepEqual(registry._uniqueLookups, orderedSearchPaths);
  });
}

expectResolutions('component:foo-bar', [
  // "old" resolver:
             `${modulePrefix}/foo-bar/component`,
  underscore(`${modulePrefix}/foo-bar/component`),

             `${modulePrefix}/components/foo-bar/component`,
  underscore(`${modulePrefix}/components/foo-bar/component`),

             `${modulePrefix}/components/foo-bar`,
  underscore(`${modulePrefix}/components/foo-bar`),

  // "unified" resolver:
  `${modulePrefix}/src/ui/components/foo-bar/component`,
  `${modulePrefix}/src/ui/components/foo-bar`,
]);

expectResolutions('template:components/foo-bar', [
  // "old" resolver:
             `${modulePrefix}/foo-bar/template`,
  underscore(`${modulePrefix}/foo-bar/template`),

             `${modulePrefix}/components/foo-bar/template`,
  underscore(`${modulePrefix}/components/foo-bar/template`),

             `${modulePrefix}/templates/components/foo-bar`,
  underscore(`${modulePrefix}/templates/components/foo-bar`),

  // "unified" resolver:
  `${modulePrefix}/src/ui/components/foo-bar/template`,
  `${modulePrefix}/src/ui/components/foo-bar:template`,
]);

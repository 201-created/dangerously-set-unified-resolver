import Ember from 'ember';
import GlimmerResolver from '@glimmer/resolver/resolver';
import RequireJSRegistry from '../../module-registries/requirejs';

const { DefaultResolver } = Ember;

/*
 * Wrap the @glimmer/resolver in Ember's resolver API. Although
 * this code extends from the DefaultResolver, it should never
 * call `_super` or call into that code.
 */
const Resolver = DefaultResolver.extend({
  init() {
    this._super(...arguments);

    if (!this.glimmerModuleRegistry) {
      this.glimmerModuleRegistry = new RequireJSRegistry(this.config, 'src');
    }

    this._glimmerResolver = new GlimmerResolver(this.config, this.glimmerModuleRegistry);
  },

  normalize: null,

  // This makes some hacky assumptions that we only look up components.
  // Need to think of a more general solution that can be configurable.
  // See the tests for examples of what gets passed from Ember.
  expandLocalLookup(fullName, source) {
    if (!source) { return; }
    let namespaceRegex = /template:(.*)\/templates\/src\/ui\/(.*)\/template\/hbs/;
    let match = source.match(namespaceRegex);

    if (!match || match.length < 3) { return; }
    let appName = match[1];
    let namespace = match[2];

    match = fullName.match(/(.*):(components\/)?(.*)/);
    if (!match || match.length < 4) { return; }
    let type = match[1];
    let name = match[3];

    let expandedPath = `${type}:/${appName}/${namespace}/-components/${name}`;
    let exists = this.glimmerRegistry.has(this._glimmerResolver.identify(expandedPath));

    return exists && expandedPath;
  },

  resolve(lookupString) {
    return this._resolve(lookupString);
  },

  _resolve(lookupString) {
    return this._glimmerResolver.resolve(lookupString);
  }
});

export default Resolver;

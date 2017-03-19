import Ember from 'ember';
import GlimmerResolver from '@glimmer/resolver/resolver';
import RequireJSRegistry from './utils/requirejs-registry';

const { DefaultResolver } = Ember;
const { dasherize } = Ember.String;

const Resolver = DefaultResolver.extend({
  init() {
    this._super(...arguments);

    if (!this.glimmerRegistry) {
      this.glimmerRegistry = new RequireJSRegistry(this.config, 'src');
    }

    this._glimmerResolver = new GlimmerResolver(this.config, this.glimmerRegistry);
  },

  normalize(fullName) {
    // A) Convert underscores to dashes
    // B) Convert camelCase to dash-case, except for helpers where we want to avoid shadowing camelCase expressions
    // C) replace `.` with `/` in order to make nested controllers work in the following cases
    //      1. `needs: ['posts/post']`
    //      2. `{{render "posts/post"}}`
    //      3. `this.render('posts/post')` from Route

    let split = fullName.split(':');
    if (split.length > 1) {
      if (split[0] === 'helper') {
        return split[0] + ':' + split[1].replace(/_/g, '-');
      } else {
        return split[0] + ':' + dasherize(split[1].replace(/\./g, '/'));
      }
    } else {
      return fullName;
    }
  },

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
    console.log(`expandLocalLookup: ${fullName} ${source} -> ${expandedPath} ${exists}`);

    return exists && expandedPath;
  },

  resolve(lookupString, source) {
    let normalized = this.normalize(lookupString);
    console.log(`resolving ${lookupString} source: ${source}`);
    return this._glimmerResolver.resolve(normalized, source);
  }
});

export default Resolver;

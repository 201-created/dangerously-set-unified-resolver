import Ember from 'ember';
import makeDictionary from './utils/make-dictionary';
import GlimmerResolver from '@glimmer/resolver/resolver';
import RequireJSRegistry from './utils/requirejs-registry';

const { DefaultResolver } = Ember;
const { dasherize } = Ember.String;

const Resolver = DefaultResolver.extend({
  init() {
    this._super(...arguments);

    this._glimmerRegistry = new RequireJSRegistry(this.config, 'src');
    this._glimmerResolver = new GlimmerResolver(this.config, this._glimmerRegistry);
    this._resolverCache = makeDictionary();
  },

    normalize: function(fullName) {
    // A) Convert underscores to dashes
    // B) Convert camelCase to dash-case, except for helpers where we want to avoid shadowing camelCase expressions
    // C) replace `.` with `/` in order to make nested controllers work in the following cases
    //      1. `needs: ['posts/post']`
    //      2. `{{render "posts/post"}}`
    //      3. `this.render('posts/post')` from Route

    var split = fullName.split(':');
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

  resolve(lookupString) {
    return this._resolverCache[lookupString] || (this._resolverCache[lookupString] = this._resolve(lookupString));
  },

  _resolve(lookupString) {
    let normalized = this.normalize(lookupString);
    console.log(`normalize ${lookupString} -> ${normalized}`);
    return this._glimmerResolver.resolve(normalized);
  }
});

export default Resolver;

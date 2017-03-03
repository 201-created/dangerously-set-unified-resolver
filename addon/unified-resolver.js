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

  // test case fullName: "component:my-button"
  // source: "template:my-app/templates/src/ui/components/my-input/template/hbs"
  // "template:components/my-button" -> "template:components/my-input/my-button"
  // Here's a super-hacky and hardcoded way to parse the namespace that we want to a

  // template:/my-app/components/
  expandLocalLookup(fullName, source) {
    let namespaceRegex = /template:(.*)\/templates\/src\/ui\/(.*)\/template\/hbs/;
    let match = source.match(namespaceRegex);
    let appName = match[1];
    let namespace = match[2];

    match = fullName.match(/(.*):(components\/)?(.*)/);
    let type = match[1];
    let name = match[3];

    let expandedPath = `${type}:/${appName}/${namespace}/${name}`;

    // TODO non-performant. Need a non-error-throwing way of checking
    // if the expandedPath actually exists.
    try {
      this.resolve(expandedPath);
    } catch(e) {
      console.log(`expandedLocalLookup ERROR ${fullName} ${source} --> ${expandedPath}`);
      return;
    }

    console.log(`expandLocalLookup ${fullName} ${source} --> ${expandedPath}`);
    return expandedPath;
  },

  resolve(lookupString) {
    return this._resolverCache[lookupString] || (this._resolverCache[lookupString] = this._resolve(lookupString));
  },

  _resolve(lookupString) {
    let normalized = this.normalize(lookupString);
    return this._glimmerResolver.resolve(normalized);
  }
});

export default Resolver;

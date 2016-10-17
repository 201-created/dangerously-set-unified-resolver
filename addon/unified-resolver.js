import DynamicResolver from './dynamic-resolver';
import FallbackResolver from './resolver';

export default DynamicResolver.extend({
  init() {
    this._super(...arguments);
    this._fallbackResolver = new FallbackResolver(...arguments);
  },

  resolve() {
    let resolved = this._fallbackResolver.resolve(...arguments);
    if (resolved) {
      return resolved;
    }

    return this._super(...arguments);
  }
});

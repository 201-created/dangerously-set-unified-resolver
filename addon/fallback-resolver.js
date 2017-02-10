import Resolver from './resolver';
import UnifiedResolver from './unified-resolver';

export default UnifiedResolver.extend({
  init() {
    this._super(...arguments);
    this._fallbackResolver = new Resolver(...arguments);

    // TODO find more general way to pass all properties that were passed to create;
    this._fallbackResolver.namespace = this.namespace;
  },

  _resolve() {
    return this._fallbackResolver.resolve(...arguments) || this._super(...arguments);
  }
});

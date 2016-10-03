import { module, test } from 'qunit';
import Resolver from 'dangerously-set-unified-resolver/unified-resolver';

module('ember-resolver/unified-resolver #normalize', {
  beforeEach() {
    this.resolver = Resolver.create();
  }
});

test('normalize components/my-input', function(assert) {
  assert.equal(this.resolver.normalize('component:my-input'), 'component:my-input', 'normalize preserves dasherization for component:my-input');
});

test('normalize route:my-input', function(assert) {
  assert.equal(this.resolver.normalize('route:my-input'), 'route:my-input', 'normalize preserves dasherization for route:my-input');
});

test('normalize helper:my-input', function(assert) {
  assert.equal(this.resolver.normalize('helper:my-input'), 'helper:my-input', 'normalize preserves dasherization for helper:my-input');
});

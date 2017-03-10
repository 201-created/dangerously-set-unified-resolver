import { module, test } from 'qunit';
import Resolver from 'dangerously-set-unified-resolver/unified-resolver';
import { config } from '../requirejs-registry-test';

module('ember-resolver/unified-resolver #expandLocalLookup', {
  beforeEach() {
    this.resolver = Resolver.create({
      config,
      glimmerRegistry: {
        entries: [],
        has(path) {
          return path in this.entries;
        }
      }
    });

    this.registerPath = (path) => {
      this.resolver.glimmerRegistry.entries[path] = true;
    };
  }
});

test('expandLocalLookup returns absolute specifier when the registry has it.', function(assert) {
  assert.expect(4);

  [
    [
      'component:my-button',
      'template:my-app/templates/src/ui/routes/index/template/hbs',
      'component:/my-app/routes/index/my-button'
    ],
    [
      'template:components/my-button',
      'template:my-app/templates/src/ui/routes/index/template/hbs',
      'template:/my-app/routes/index/my-button'
    ],
    [
      'component:my-button',
      'template:my-app/templates/src/ui/components/my-input/template/hbs',
      'component:/my-app/components/my-input/my-button'
    ],
    [
      'template:components/my-button',
      'template:my-app/templates/src/ui/components/my-input/template/hbs',
      'template:/my-app/components/my-input/my-button'
    ]
  ].forEach(([ fullName, source, expected ]) => {
    this.registerPath(expected);
    assert.equal(this.resolver.expandLocalLookup(fullName, source), expected, `expected ${expected} for ${fullName} from ${source}.`);
  });
});

test('expandLocalLookup returns null when registry.has returns null', function(assert) {
  let fullName = 'component:foo-bar';
  let source = 'template:my-app/templates/src/ui/routes/index/template/hbs';
  assert.notOk(this.resolver.expandLocalLookup(fullName, source));
});

test('expandLocalLookup returns null when it cannot parse the source', function(assert) {
  let fullName = 'component:foo-bar';
  assert.notOk(this.resolver.expandLocalLookup(fullName));
  assert.notOk(this.resolver.expandLocalLookup(fullName, 'blah'));
  assert.notOk(this.resolver.expandLocalLookup(fullName, 'template/blah'));
});

test('expandLocalLookup returns null when it cannot parse the fullName', function(assert) {
  let source = 'template:my-app/templates/src/ui/routes/index/template/hbs';
  assert.notOk(this.resolver.expandLocalLookup('foo-bar', source));
});

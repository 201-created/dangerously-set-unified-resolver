import { module, test } from 'qunit';
import Resolver from 'dangerously-set-unified-resolver/unified-resolver';

module('ember-resolver/unified-resolver #expandLocalLookup', {
  beforeEach() {
    this.resolver = Resolver.create({
      resolve() {
        // No op
      }
    });
  }
});

test('expandLookupLocalLookup', function(assert) {
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
    assert.equal(this.resolver.expandLocalLookup(fullName, source), expected, `expected ${expected} for ${fullName} from ${source}.`);
  });
});
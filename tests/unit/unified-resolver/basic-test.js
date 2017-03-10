/* jshint loopfunc:true */
import { module, test } from 'qunit';
import Resolver from 'dangerously-set-unified-resolver/unified-resolver';
import BasicRegistry from '@glimmer/resolver/module-registries/basic-registry';

module('ember-resolver/unified-resolver', {
  setup() {
    this.resolverForEntries = (config, entries) => {
      let glimmerRegistry = new BasicRegistry(entries);
      return Resolver.create({
        config,
        glimmerRegistry
      });
    };
  }
});

/*
 * "Rule 1" of the unification RFC.
 *
 * See: https://github.com/dgeb/rfcs/blob/module-unification/text/0000-module-unification.md#module-type
 */

test('Modules named main', function(assert) {
  let main = {};
  let resolver = this.resolverForEntries({
    app: {
      name: 'example-app'
    },
    types: {
      router: { definitiveCollection: 'main' }
    },
    collections: {
      main: {
        types: [ 'router' ]
      }
    }
  }, {
    'router:/app/main/main': main
  });

  assert.equal(
    resolver.resolve('router:/app/main/main'),
    main,
    'absolute module specifier resolved'
  );

  assert.equal(
    resolver.resolve('router:main'),
    main,
    'relative module specifier resolved'
  );
});

test('Resolving when a module is not defined', function(assert) {
  let resolver = this.resolverForEntries({
    app: {
      name: 'example-app'
    },
    types: {
      router: { definitiveCollection: 'main' }
    },
    collections: {
      main: {
        types: [ 'router' ]
      }
    }
  }, {});

  assert.equal(
    resolver.resolve('router:/app/main/main'),
    undefined,
    'absolute module specifier resolved undefined'
  );

  assert.equal(
    resolver.resolve('router:main'),
    undefined,
    'relative module specifier resolved undefined'
  );
});


/*
 * "Rule 2" of the unification RFC.
 *
 * See: https://github.com/dgeb/rfcs/blob/module-unification/text/0000-module-unification.md#module-type
 */

test('Resolving in a collection', function(assert) {
  let service = {};
  let resolver = this.resolverForEntries({
    app: {
      name: 'example-app'
    },
    types: {
      service: { definitiveCollection: 'services' }
    },
    collections: {
      services: {
        types: [ 'service' ]
      }
    }
  }, {
    'service:/app/services/i18n': service
  });

  assert.equal(
    resolver.resolve('service:/app/services/i18n'),
    service,
    'absolute module specifier resolved'
  );

  assert.equal(
    resolver.resolve('service:i18n'),
    service,
    'relative module specifier resolved'
  );
});

/*
 * "Rule 2" of the unification RFC with a group.
 */

test('Resolving within a definitiveCollection', function(assert) {
  let helper = {};
  let resolver = this.resolverForEntries({
    app: {
      name: 'example-app'
    },
    types: {
      helper: { definitiveCollection: 'components' }
    },
    collections: {
      components: {
        group: 'ui',
        types: [ 'helper' ]
      }
    }
  }, {
    'helper:/app/components/capitalize': helper
  });

  assert.equal(
    resolver.resolve('helper:/app/components/capitalize'),
    helper,
    'absolute module specifier resolved'
  );

  assert.equal(
    resolver.resolve('helper:capitalize'),
    helper,
    'relative module specifier resolved'
  );
});

test('Resolving within a definitiveCollection', function(assert) {
  let helper = {};
  let resolver = this.resolverForEntries({
    app: {
      name: 'example-app'
    },
    types: {
      helper: { definitiveCollection: 'components' }
    },
    collections: {
      components: {
        group: 'ui',
        types: [ 'helper' ]
      }
    }
  }, {
    'helper:/app/components/capitalize': helper
  });

  assert.equal(
    resolver.resolve('helper:/app/components/capitalize'),
    helper,
    'absolute module specifier resolved'
  );

  assert.equal(
    resolver.resolve('helper:capitalize'),
    helper,
    'relative module specifier resolved'
  );
});

test('Resolving within a definitiveCollection with other defined types', function(assert) {
  let component = {};
  let resolver = this.resolverForEntries({
    app: {
      name: 'example-app'
    },
    types: {
      component: { definitiveCollection: 'components' },
      helper: { definitiveCollection: 'components' }
    },
    collections: {
      components: {
        group: 'ui',
        types: [ 'component', 'helper' ]
      }
    }
  }, {
    'component:/app/components/capitalize': component
  });

  assert.equal(
    resolver.resolve('component:/app/components/capitalize'),
    component,
    'absolute module specifier resolved'
  );

  assert.equal(
    resolver.resolve('component:capitalize'),
    component,
    'relative module specifier resolved'
  );
});

test('Can resolve with a / in the specifier', function(assert) {
  let route = {};
  let resolver = this.resolverForEntries({
    app: {
      name: 'example-app'
    },
    types: {
      route: { definitiveCollection: 'routes' }
    },
    collections: {
      routes: {
        group: 'ui',
        types: [ 'route' ]
      }
    }
  }, {
    'route:/app/routes/my-form/my-input': route
  });

  assert.equal(
    resolver.resolve('route:/app/routes/my-form/my-input'),
    route,
    'absolute module specifier not resolved'
  );

  assert.equal(
    resolver.resolve('route:my-form/my-input'),
    route,
    'relative module specifier not resolved'
  );
});

/*
 * "Rule 3" of the unification RFC. Rule 3 means a default type for a collection
 * is configured.
 *
 * There is no runtime implementation of this part of the spec.
 */

/**
 * Private Collections
 */

test('Can resolve a relative with a source', function(assert) {
  let component = {};
  let resolver = this.resolverForEntries({
    app: {
      name: 'example-app'
    },
    types: {
      component: { definitiveCollection: 'components' },
      template: { definitiveCollection: 'components' }
    },
    collections: {
      components: {
        group: 'ui',
        types: [ 'component', 'template' ]
      }
    }
  }, {
    'component:/app/components/my-form/my-input': component
  });

  assert.equal(
    resolver.resolve('component:my-input', 'template:/app/components/my-form'),
    component,
    'relative module specifier with source resolved'
  );
});

test('Can resolve a relative that requires a private collection with a source', function(assert) {
  let component = {};
  let resolver = this.resolverForEntries({
    app: {
      name: 'example-app'
    },
    types: {
      component: { definitiveCollection: 'components' },
      route: { definitiveCollection: 'routes' },
      template: { definitiveCollection: 'components' }
    },
    collections: {
      components: {
        group: 'ui',
        types: [ 'component', 'template' ]
      },
      routes: {
        group: 'ui',
        types: [ 'route', 'template' ]
      }
    }
  }, {
    'component:/app/routes/posts/-components/my-input': component
  });

  assert.equal(
    resolver.resolve('component:my-input', 'template:/app/routes/posts'),
    component,
    'relative module specifier with source resolved'
  );
});

test('Can resolve a relative of another valid type in the collection of the source', function(assert) {
  let template = {};
  let resolver = this.resolverForEntries({
    app: {
      name: 'example-app'
    },
    types: {
      component: { definitiveCollection: 'components' },
      route: { definitiveCollection: 'routes' },
      template: { definitiveCollection: 'components' }
    },
    collections: {
      components: {
        group: 'ui',
        types: [ 'component', 'template' ]
      },
      routes: {
        group: 'ui',
        types: [ 'route', 'template' ]
      }
    }
  }, {
    'template:/app/routes/posts/my-input': template
  });

  assert.equal(
    resolver.resolve('template:my-input', 'template:/app/routes/posts'),
    template,
    'relative module specifier with source resolved'
  );
});

test('Can not resolve a top level template of a non-definitive type', function(assert) {
  let template = {};
  let resolver = this.resolverForEntries({
    app: {
      name: 'example-app'
    },
    types: {
      component: { definitiveCollection: 'components' },
      route: { definitiveCollection: 'routes' },
      template: { definitiveCollection: 'components' }
    },
    collections: {
      components: {
        group: 'ui',
        types: [ 'component', 'template' ]
      },
      routes: {
        group: 'ui',
        types: [ 'route', 'template' ]
      }
    }
  }, {
    'template:/app/routes/my-input': template
  });

  assert.equal(
    resolver.resolve('template:my-input', 'template:/app/routes/posts'),
    undefined,
    'relative module specifier with source resolved'
  );
});

test('Can resolve a top level template of a definitive type', function(assert) {
  let template = {};
  let resolver = this.resolverForEntries({
    app: {
      name: 'example-app'
    },
    types: {
      component: { definitiveCollection: 'components' },
      route: { definitiveCollection: 'routes' },
      template: { definitiveCollection: 'components' }
    },
    collections: {
      components: {
        group: 'ui',
        types: [ 'component', 'template' ]
      },
      routes: {
        group: 'ui',
        types: [ 'route', 'template' ]
      }
    }
  }, {
    'template:/app/components/my-input': template
  });

  assert.equal(
    resolver.resolve('template:my-input', 'template:/app/routes/posts'),
    template,
    'relative module specifier with source resolved'
  );
});
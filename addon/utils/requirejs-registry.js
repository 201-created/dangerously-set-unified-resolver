/* global require, requirejs */
import {
  deserializeSpecifier
} from '@glimmer/di';

export default class RequireJSRegistry {

  constructor(config, modulePrefix) {
    this._config = config;
    this._modulePrefix = modulePrefix;
  }

  normalize(specifier) {
    let s = deserializeSpecifier(specifier);

    let isPartial = s.type === 'template' && s.name[0] === '-';
    if (isPartial) {
      s.name = s.name.slice(1);
      s.collection = 'partials';
    }

    let collectionDefinition = this._config.collections[s.collection];
    let group = collectionDefinition && collectionDefinition.group;
    let segments = [ s.rootName, this._modulePrefix ];

    if (group) {
      segments.push(group);
    }

    // Special case to handle definiteCollection for templates
    // eventually want to find a better way to address.
    let ignoreCollection = s.type === 'template' &&
      s.collection === 'routes' &&
      s.namespace === 'components';

    if (s.collection !== 'main' && !ignoreCollection) {
      segments.push(s.collection);
    }

    if (s.namespace) {
      segments.push(s.namespace);
    }

    if (s.name !== 'main') {
      segments.push(s.name);
    }

    if (!isPartial) {
      segments.push(s.type);
    }

    let path = segments.join('/');

    console.log(`requirejs ${specifier} -> ${path}`);
    return path;
  }

  has(specifier) {
    let path = this.normalize(specifier);
    return path in requirejs.entries;
  }

  get(specifier) {
    let path = this.normalize(specifier);
    return require(path).default;
  }
}

declare var requirejs;
declare var require;
declare var console;

import { ModuleRegistry } from "@glimmer/resolver/module-registry";
import ResolverConfiguration from "@glimmer/resolver/resolver-configuration";

import {
  deserializeSpecifier
} from '@glimmer/di';

export default class RequireJSRegistry implements ModuleRegistry {
  private _config: ResolverConfiguration;
  private _modulePrefix: string;

  constructor(config: ResolverConfiguration, modulePrefix: string) {
    this._config = config;
    this._modulePrefix = modulePrefix;
  }

  normalize(specifier: string): string {
    let s = deserializeSpecifier(specifier);

    let namespace = s.namespace || s.collection;
    let type = namespace === 'main' ? s.type : namespace;
    let collection = this._config.collections[namespace];
    let group = collection && collection.group;

    if (group) {
      type = `${group}/${type}`;
    }

    let path = `${s.rootName}/${this._modulePrefix}/${type}`;

    if (s.name !== 'main') {
      path += `/${s.name}`;
    }

    if (s.collection !== 'main') {
      path += `/${s.type}`;
    }

    console.log(`requirejs ${specifier} -> ${path}`);
    return path;
  }

  has(specifier: string): boolean {
    let path = this.normalize(specifier);
    return path in requirejs.entries;
  }

  get(specifier: string): any {
    let path = this.normalize(specifier);
    return require(path).default;
  }
}

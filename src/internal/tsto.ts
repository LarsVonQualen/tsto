import { TstoObjectManager } from './tsto-object-manager';
import { Constructor } from './types/constructor.type';

export function tsto<T extends object>() {
  return (constructor: Constructor<T>) => {
    if (!constructor.prototype.__tsto) {
      constructor.prototype.__tsto = new TstoObjectManager(constructor);
    }
  };
}

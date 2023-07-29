import { TstoObjectManager } from './tsto-object-manager';
import { Constructor } from './types/constructor.type';

export function tsto<T>() {
  return (target: Constructor<T>) => {
    if (!target.prototype.__tsto) {
      target.prototype.__tsto = new TstoObjectManager(target);
    }
  };
}

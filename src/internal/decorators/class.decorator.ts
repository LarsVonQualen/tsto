import { getObjectManager } from '../get-object-manager.fn';
import { Constructor } from '../types/constructor.type';

export function classDecorator<T>() {
  return (target: Constructor<T>) => {
    getObjectManager(target);
  };
}

import { getObjectManager } from './get-object-manager.fn';
import { Constructor } from './types/constructor.type';

export function tstoFrom<Target>(obj: any, to: Constructor<Target>) {
  return getObjectManager(to).from(obj);
}

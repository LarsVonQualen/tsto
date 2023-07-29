import { getObjectManager } from './get-object-manager.fn';
import { Constructor } from './types/constructor.type';

export function from<Target>(
  obj: any,
  to: Constructor<Target>,
): Target | undefined | null {
  return getObjectManager<Target>(to).from(obj);
}

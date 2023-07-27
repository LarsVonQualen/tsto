import { Constructor } from './types/constructor.type';
import { getObjectManager } from './get-object-manager.fn';

export function tstoFrom<Target extends object>(
  object: object,
  to: Constructor<Target>,
): Target | undefined | null;
export function tstoFrom<Target extends object>(
  json: string,
  to: Constructor<Target>,
): Target | undefined | null;
export function tstoFrom<Target extends object>(
  jsonOrObject: object | string,
  to: Constructor<Target>,
): Target | undefined | null {
  const objectManager = getObjectManager(to);

  if (typeof jsonOrObject === 'string') {
    const obj = JSON.parse(jsonOrObject);

    return objectManager.from(obj);
  }

  return objectManager.from(jsonOrObject);
}

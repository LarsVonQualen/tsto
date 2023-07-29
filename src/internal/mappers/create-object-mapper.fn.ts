import { ObjectManager } from '../object-manager';
import { Options } from '../types/options.type';

export function createObjectMapper<Target>(
  options: Options,
  objectManager: ObjectManager<Target>,
) {
  return (rawValue?: object | null) => {
    if (options.nullable === true && rawValue === null) {
      return null;
    }

    if (options.undefineable === true && rawValue === undefined) {
      return undefined;
    }

    return objectManager.from(rawValue);
  };
}

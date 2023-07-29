import { ObjectManager } from '../object-manager';
import { Options } from '../types/options.type';
import { createObjectMapper } from './create-object-mapper.fn';

export function createObjectArrayMapper<Target>(
  options: Options,
  objectManager: ObjectManager<Target>,
) {
  const objectMapper = createObjectMapper<Target>(
    {
      nullable: true,
      undefineable: true,
    },
    objectManager,
  );

  return (rawValue?: object[] | null) => {
    if (options.nullable === true && rawValue === null) {
      return null;
    }

    if (options.undefineable === true && rawValue === undefined) {
      return undefined;
    }

    return rawValue?.map(obj => objectMapper(obj));
  };
}

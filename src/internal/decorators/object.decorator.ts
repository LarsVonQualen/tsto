import { getObjectManager } from '../get-object-manager.fn';
import { createObjectMapper } from '../mappers/create-object-mapper.fn';
import { Constructor } from '../types/constructor.type';
import { Options } from '../types/options.type';

export function objectDecorator<Target>(
  objectType: Constructor<Target>,
  options?: Options,
) {
  const childObjectManager = getObjectManager(objectType);
  const opts: Options = {
    nullable: true,
    undefineable: true,
    ...(options ?? {}),
  };
  const mapper = createObjectMapper(opts, childObjectManager);

  return (target: any, key?: string, parameterIndex?: any) => {
    getObjectManager(target).registerHandler(mapper, key, parameterIndex);
  };
}

import { getObjectManager } from '../get-object-manager.fn';
import { createObjectArrayMapper } from '../mappers/create-object-array-mapper.fn';
import { Constructor } from '../types/constructor.type';
import { Options } from '../types/options.type';

export function objectArrayDecorator(
  arrayElementType: Constructor<any>,
  options?: Options,
): (target: any, key?: string, parameterIndex?: any) => void {
  const childObjectManager = getObjectManager(arrayElementType);
  const opts: Options = {
    nullable: true,
    undefineable: true,
    ...(options ?? {}),
  };
  const mapper = createObjectArrayMapper(opts, childObjectManager);

  return (target: any, key?: string, parameterIndex?: any) => {
    getObjectManager(target).registerHandler(mapper, key, parameterIndex);
  };
}

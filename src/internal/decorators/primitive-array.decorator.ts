import { getObjectManager } from '../get-object-manager.fn';
import { createPrimitiveArrayMapper } from '../mappers/create-primitive-array-mapper.fn';
import { Options } from '../types/options.type';
import { SupportedPrimitiveTypes } from '../types/supported-property-types.type';

export function primitiveArrayDecorator(
  arrayElementType: SupportedPrimitiveTypes,
  options?: Options,
): (target: any, key?: string, parameterIndex?: any) => void {
  const opts: Options = {
    nullable: true,
    undefineable: true,
    ...(options ?? {}),
  };
  const mapper = createPrimitiveArrayMapper(opts, arrayElementType);

  return (target: any, key?: string, parameterIndex?: any) => {
    getObjectManager(target).registerHandler(mapper, key, parameterIndex);
  };
}

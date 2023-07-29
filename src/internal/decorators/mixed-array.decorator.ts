import { getObjectManager } from '../get-object-manager.fn';
import { createMixedArrayMapper } from '../mappers/create-mixed-array-mapper.fn';
import { MixedArrayElementTypes } from '../types/mixed-array-element-types.type';
import { Options } from '../types/options.type';

export function mixedArrayDecorator(
  arrayElementTypes: MixedArrayElementTypes[],
  options?: Options,
): (target: any, key?: string, parameterIndex?: any) => void {
  const opts: Options = {
    nullable: true,
    undefineable: true,
    ...(options ?? {}),
  };
  const mapper = createMixedArrayMapper(opts, arrayElementTypes);

  return (target: any, key?: string, parameterIndex?: any) => {
    getObjectManager(target).registerHandler(mapper, key, parameterIndex);
  };
}

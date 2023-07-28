import { getObjectManager } from './get-object-manager.fn';
import { TstoOptions } from './types/tsto-options.type';

export function tstoObjectArray(
  arrayElementType: Function,
  options?: TstoOptions,
) {
  return (target: any, key?: string, parameterIndex?: any) => {
    const childObjectManager = getObjectManager(arrayElementType);

    if (key !== undefined) {
      getObjectManager(target)?.registerObjectArray(
        key,
        childObjectManager,
        options,
      );
    } else {
      getObjectManager(target)?.registerConstructorParameter(
        parameterIndex,
        'object-array',
        childObjectManager,
        options,
      );
    }
  };
}

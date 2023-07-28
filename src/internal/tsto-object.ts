import { getObjectManager } from './get-object-manager.fn';
import { TstoOptions } from './types/tsto-options.type';

export function tstoObject(objectType: Function, options?: TstoOptions) {
  return (target: any, key?: string, parameterIndex?: any) => {
    const childObjectManager = getObjectManager(objectType);

    if (key !== undefined) {
      getObjectManager(target)?.registerObject(
        key,
        childObjectManager,
        options,
      );
    } else {
      getObjectManager(target)?.registerConstructorParameter(
        parameterIndex,
        'object',
        childObjectManager,
        options,
      );
    }
  };
}

import { getObjectManager } from './get-object-manager.fn';
import { TstoOptions } from './types/tsto-options.type';

export function tstoNumber(options?: TstoOptions) {
  return (target: any, key?: string, parameterIndex?: any) => {
    if (key !== undefined) {
      getObjectManager(target)?.registerNumber(key, options);
    } else {
      getObjectManager(target)?.registerConstructorParameter(
        parameterIndex,
        'number',
        undefined,
        options,
      );
    }
  };
}

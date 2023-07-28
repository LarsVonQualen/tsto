import { getObjectManager } from './get-object-manager.fn';
import { TstoOptions } from './types/tsto-options.type';

export function tstoString(options?: TstoOptions) {
  return (target: any, key?: string, parameterIndex?: any) => {
    if (key !== undefined) {
      getObjectManager(target)?.registerString(key, options);
    } else {
      getObjectManager(target)?.registerConstructorParameter(
        parameterIndex,
        'string',
        undefined,
        options,
      );
    }
  };
}

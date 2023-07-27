import { getObjectManager } from './get-object-manager.fn';
import { TstoOptions } from './types/tsto-options.type';

export function tstoString(options?: TstoOptions) {
  return (target: any, key: string) => {
    getObjectManager(target)?.registerString(key, options);
  };
}

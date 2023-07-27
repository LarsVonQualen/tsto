import { getObjectManager } from './get-object-manager.fn';
import { TstoOptions } from './types/tsto-options.type';

export function tstoNumber(options?: TstoOptions) {
  return (target: any, key: string) => {
    getObjectManager(target)?.registerNumber(key, options);
  };
}

import { getObjectManager } from './get-object-manager.fn';
import { TstoOptions } from './types/tsto-options.type';

export function tstoObject(objectType: Function, options?: TstoOptions) {
  return (target: any, key: string) => {
    const childObjectManager = getObjectManager(objectType);

    getObjectManager(target)?.registerObject(key, childObjectManager, options);
  };
}

import { getObjectManager } from './get-object-manager.fn';
import { TstoOptions } from './types/tsto-options.type';

export function tstoObjectArray(
  arrayElementType: Function,
  options?: TstoOptions,
) {
  return (target: any, key: string) => {
    const childObjectManager = getObjectManager(arrayElementType);

    getObjectManager(target)?.registerObjectArray(
      key,
      childObjectManager,
      options,
    );
  };
}

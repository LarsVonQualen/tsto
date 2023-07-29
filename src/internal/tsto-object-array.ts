import { getObjectManager } from './get-object-manager.fn';
import { TstoObjectManager } from './tsto-object-manager';
import { Constructor } from './types/constructor.type';
import { TstoOptions } from './types/tsto-options.type';

function createObjectArrayMapper<Target>(
  options: TstoOptions,
  objectManager: TstoObjectManager<Target>,
) {
  return (rawValue?: object[] | null) => {
    if (options.nullable === true && rawValue === null) {
      return null;
    }

    if (options.undefineable === true && rawValue === undefined) {
      return undefined;
    }

    return rawValue?.map(obj => objectManager.from(obj));
  };
}

function createObjectArrayValidator<Target>(
  options: TstoOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  objectManager: TstoObjectManager<Target>,
) {
  return (rawValue?: Target[] | null) => {
    const errors: string[] = [];

    if (options.nullable === false && rawValue === null) {
      errors.push('cannot be null');
    }

    if (options.undefineable === false && rawValue === undefined) {
      errors.push('cannot be undefined');
    }
  };
}

export function tstoObjectArray(
  arrayElementType: Constructor<any>,
  options?: TstoOptions,
): (target: any, key?: string, parameterIndex?: any) => void {
  const childObjectManager = getObjectManager(arrayElementType);
  const opts: TstoOptions = {
    nullable: true,
    undefineable: true,
    ...(options ?? {}),
  };
  const mapper = createObjectArrayMapper(opts, childObjectManager);
  const validator = createObjectArrayValidator(opts, childObjectManager);

  return (target: any, key?: string, parameterIndex?: any) => {
    getObjectManager(target).registerHandler(
      mapper,
      validator,
      key,
      parameterIndex,
    );
  };
}

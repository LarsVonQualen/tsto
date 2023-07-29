import { getObjectManager } from './get-object-manager.fn';
import { TstoObjectManager } from './tsto-object-manager';
import { Constructor } from './types/constructor.type';
import { TstoOptions } from './types/tsto-options.type';

function createObjectMapper<Target>(
  options: TstoOptions,
  objectManager: TstoObjectManager<Target>,
) {
  return (rawValue?: object | null) => {
    if (options.nullable === true && rawValue === null) {
      return null;
    }

    if (options.undefineable === true && rawValue === undefined) {
      return undefined;
    }

    return objectManager.from(rawValue);
  };
}

function createObjectValidator<Target>(
  options: TstoOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  objectManager: TstoObjectManager<Target>,
) {
  return (rawValue?: object | null) => {
    const errors: string[] = [];

    if (options.nullable === false && rawValue === null) {
      errors.push('cannot be null');
    }

    if (options.undefineable === false && rawValue === undefined) {
      errors.push('cannot be undefined');
    }
  };
}
export function tstoObject<Target>(
  objectType: Constructor<Target>,
  options?: TstoOptions,
) {
  const childObjectManager = getObjectManager(objectType);
  const opts: TstoOptions = {
    nullable: true,
    undefineable: true,
    ...(options ?? {}),
  };
  const mapper = createObjectMapper(opts, childObjectManager);
  const validator = createObjectValidator(opts, childObjectManager);

  return (target: any, key?: string, parameterIndex?: any) => {
    getObjectManager(target).registerHandler(
      mapper,
      validator,
      key,
      parameterIndex,
    );
  };
}

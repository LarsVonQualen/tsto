import { getObjectManager } from './get-object-manager.fn';
import { TstoOptions } from './types/tsto-options.type';

function createStringMapper(options: TstoOptions) {
  return (rawValue?: string | null) => {
    if (options.nullable === true && rawValue === null) {
      return null;
    }

    if (options.undefineable === true && rawValue === undefined) {
      return undefined;
    }

    return String(rawValue ?? '');
  };
}

function createStringValidator(options: TstoOptions) {
  return (rawValue?: string | null) => {
    const errors: string[] = [];

    if (options.nullable === false && rawValue === null) {
      errors.push('cannot be null');
    }

    if (options.undefineable === false && rawValue === undefined) {
      errors.push('cannot be undefined');
    }
  };
}

export function tstoString(options?: TstoOptions) {
  const opts: TstoOptions = {
    nullable: true,
    undefineable: true,
    ...(options ?? {}),
  };
  const mapper = createStringMapper(opts);
  const validator = createStringValidator(opts);

  return (target: any, key?: string, parameterIndex?: any) => {
    getObjectManager(target).registerHandler(
      mapper,
      validator,
      key,
      parameterIndex,
    );
  };
}

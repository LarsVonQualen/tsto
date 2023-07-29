import { getObjectManager } from './get-object-manager.fn';
import { MixedArrayElementTypes } from './types/mixed-array-element-types.type';
import { TstoOptions } from './types/tsto-options.type';

function createMixedArrayMapper(
  options: TstoOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  arrayElementTypes: MixedArrayElementTypes[],
) {
  return (rawValue?: any[] | null) => {
    if (options.nullable === true && rawValue === null) {
      return null;
    }

    if (options.undefineable === true && rawValue === undefined) {
      return undefined;
    }

    return rawValue?.map(obj => obj);
  };
}

function createMixedArrayValidator(
  options: TstoOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  arrayElementTypes: MixedArrayElementTypes[],
) {
  return (rawValue?: any[] | null) => {
    const errors: string[] = [];

    if (options.nullable === false && rawValue === null) {
      errors.push('cannot be null');
    }

    if (options.undefineable === false && rawValue === undefined) {
      errors.push('cannot be undefined');
    }
  };
}

export function tstoMixedArray(
  arrayElementTypes: MixedArrayElementTypes[],
  options?: TstoOptions,
): (target: any, key?: string, parameterIndex?: any) => void {
  const opts: TstoOptions = {
    nullable: true,
    undefineable: true,
    ...(options ?? {}),
  };
  const mapper = createMixedArrayMapper(opts, arrayElementTypes);
  const validator = createMixedArrayValidator(opts, arrayElementTypes);

  return (target: any, key?: string, parameterIndex?: any) => {
    getObjectManager(target).registerHandler(
      mapper,
      validator,
      key,
      parameterIndex,
    );
  };
}

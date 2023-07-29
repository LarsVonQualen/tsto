import { getObjectManager } from './get-object-manager.fn';
import { TstoOptions } from './types/tsto-options.type';
import { TstoSupportedPrimitiveTypes } from './types/tsto-supported-property-types.type';

function createPrimitiveArrayMapper(
  options: TstoOptions,
  arrayElementType: TstoSupportedPrimitiveTypes,
) {
  return (rawValue?: (string | number)[] | null) => {
    if (options.nullable === true && rawValue === null) {
      return null;
    }

    if (options.undefineable === true && rawValue === undefined) {
      return undefined;
    }

    return rawValue?.map(obj =>
      arrayElementType === 'string'
        ? String(obj)
        : arrayElementType === 'number'
        ? Number(obj)
        : undefined,
    );
  };
}

function createPrimitiveArrayValidator(
  options: TstoOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  arrayElementType: TstoSupportedPrimitiveTypes,
) {
  return (rawValue?: (string | number)[] | null) => {
    const errors: string[] = [];

    if (options.nullable === false && rawValue === null) {
      errors.push('cannot be null');
    }

    if (options.undefineable === false && rawValue === undefined) {
      errors.push('cannot be undefined');
    }
  };
}

export function tstoPrimitiveArray(
  arrayElementType: TstoSupportedPrimitiveTypes,
  options?: TstoOptions,
): (target: any, key?: string, parameterIndex?: any) => void {
  const opts: TstoOptions = {
    nullable: true,
    undefineable: true,
    ...(options ?? {}),
  };
  const mapper = createPrimitiveArrayMapper(opts, arrayElementType);
  const validator = createPrimitiveArrayValidator(opts, arrayElementType);

  return (target: any, key?: string, parameterIndex?: any) => {
    getObjectManager(target).registerHandler(
      mapper,
      validator,
      key,
      parameterIndex,
    );
  };
}

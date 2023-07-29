import { Options } from '../types/options.type';
import { SupportedPrimitiveTypes } from '../types/supported-property-types.type';
import { createNumberMapper } from './create-number-mapper.fn';
import { createStringMapper } from './create-string-mapper.fn';

export function createPrimitiveArrayMapper<
  TArrayElementType extends SupportedPrimitiveTypes,
  TElementRealType extends TArrayElementType extends 'string' ? string : number,
  TRawValue extends (TElementRealType | undefined | null)[] | undefined | null,
>(
  options: Options,
  arrayElementType: TArrayElementType,
): (rawValue?: TRawValue) => TElementRealType[] | undefined | null {
  const mapper =
    arrayElementType === 'string'
      ? createStringMapper(options)
      : createNumberMapper(options);

  return (rawValue?: TRawValue) => {
    if (options.nullable === true && rawValue === null) {
      return null;
    }

    if (options.undefineable === true && rawValue === undefined) {
      return undefined;
    }

    return rawValue?.map(obj =>
      mapper(obj as unknown as any),
    ) as TElementRealType[];
  };
}

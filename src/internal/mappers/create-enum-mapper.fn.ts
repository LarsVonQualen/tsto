import { Options } from '../types/options.type';
import { StandardEnum } from '../types/standard-enum';

export function createEnumMapper<TEnumType extends StandardEnum<unknown>>(
  enumType: TEnumType,
  options: Options & {
    useStringsAsInput?: boolean;
  },
) {
  return (rawValue?: string | number | null) => {
    if (options.nullable === true && rawValue === null) {
      return null;
    }

    if (options.undefineable === true && rawValue === undefined) {
      return undefined;
    }

    return rawValue !== undefined
      ? rawValue !== null
        ? options?.useStringsAsInput === true
          ? // If we're string based get the string
            enumType[String(rawValue)]
          : // If not check that the number actually matches a string
          enumType[Number(rawValue)]
          ? Number(rawValue)
          : undefined
        : null
      : undefined;
  };
}

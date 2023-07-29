import { getObjectManager } from '../get-object-manager.fn';
import { SubArrayElementType } from '../sub-array-element-type';
import { MixedArrayElementTypes } from '../types/mixed-array-element-types.type';
import { Options } from '../types/options.type';

function findMatchingArrayElementType(
  rawValue: any,
  arrayElementTypes: MixedArrayElementTypes[],
): MixedArrayElementTypes | null | undefined {
  if (rawValue === undefined) {
    return undefined;
  }

  if (rawValue === null) {
    return null;
  }

  if (typeof rawValue === 'string') {
    const arrayElementType = arrayElementTypes.find(t => t === 'string');

    if (!arrayElementType) {
      throw new Error(
        'found string in raw value but is missing string as array element type',
      );
    }

    return arrayElementType;
  }

  if (typeof rawValue === 'number') {
    const arrayElementType = arrayElementTypes.find(t => t === 'number');

    if (!arrayElementType) {
      throw new Error(
        'found number in raw value but is missing number as array element type',
      );
    }

    return arrayElementType;
  }

  if (Array.isArray(rawValue)) {
    const arrayElementType = arrayElementTypes.find(
      t => t instanceof SubArrayElementType,
    );

    if (!arrayElementType) {
      throw new Error(
        'found array in raw value but is missing SubArrayElementType as array element type',
      );
    }

    return arrayElementType;
  }

  if (typeof rawValue === 'object') {
    const arrayElementType = arrayElementTypes.find(
      t => typeof t === 'function',
    );

    if (!arrayElementType) {
      throw new Error(
        'found object in raw value but is missing object as array element type',
      );
    }

    return arrayElementType;
  }

  return undefined;
}

export function createMixedArrayMapper(
  options: Options,
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

    return rawValue?.map(obj => {
      const arrayElementType = findMatchingArrayElementType(
        obj,
        arrayElementTypes,
      );

      if (!arrayElementType) {
        return rawValue;
      }

      if (typeof arrayElementType === 'string') {
        switch (arrayElementType) {
          case 'number':
            return Number(obj);
          case 'string':
            return String(obj);
          default:
            throw new Error(`unknown array element type: ${arrayElementType}`);
        }
      }

      if (arrayElementType instanceof SubArrayElementType) {
        const mapper = createMixedArrayMapper(
          {},
          Array.isArray(arrayElementType.subArrayElementType)
            ? arrayElementType.subArrayElementType
            : [arrayElementType.subArrayElementType],
        );

        return mapper(obj);
      }

      if (typeof arrayElementType === 'function') {
        return getObjectManager(arrayElementType).from(obj);
      }

      return undefined;
    });
  };
}

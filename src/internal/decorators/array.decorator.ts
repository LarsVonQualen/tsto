import { MixedArrayElementTypes } from '../types/mixed-array-element-types.type';
import { Options } from '../types/options.type';
import { SimpleArrayElementTypes } from '../types/simple-array-element-types.type';
import { mixedArrayDecorator } from './mixed-array.decorator';
import { objectArrayDecorator } from './object-array.decorator';
import { primitiveArrayDecorator } from './primitive-array.decorator';

export function arrayDecorator(
  arrayElementTypeOrTypes: SimpleArrayElementTypes | MixedArrayElementTypes[],
  options?: Options,
): (target: any, key?: string, parameterIndex?: any) => void {
  if (typeof arrayElementTypeOrTypes === 'string') {
    return primitiveArrayDecorator(arrayElementTypeOrTypes, options);
  }

  if (Array.isArray(arrayElementTypeOrTypes)) {
    return mixedArrayDecorator(arrayElementTypeOrTypes, options);
  }

  if (typeof arrayElementTypeOrTypes === 'function') {
    return objectArrayDecorator(arrayElementTypeOrTypes, options);
  }

  throw new Error('unknown array element type specification');
}

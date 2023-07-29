import { tstoMixedArray } from './tsto-mixed-array';
import { tstoObjectArray } from './tsto-object-array';
import { tstoPrimitiveArray } from './tsto-primitive-array';
import { MixedArrayElementTypes } from './types/mixed-array-element-types.type';
import { SimpleArrayElementTypes } from './types/simple-array-element-types.type';
import { TstoOptions } from './types/tsto-options.type';

export function tstoArray(
  arrayElementTypeOrTypes: SimpleArrayElementTypes | MixedArrayElementTypes[],
  options?: TstoOptions,
): (target: any, key?: string, parameterIndex?: any) => void {
  if (typeof arrayElementTypeOrTypes === 'string') {
    return tstoPrimitiveArray(arrayElementTypeOrTypes, options);
  }

  if (Array.isArray(arrayElementTypeOrTypes)) {
    return tstoMixedArray(arrayElementTypeOrTypes, options);
  }

  if (typeof arrayElementTypeOrTypes === 'function') {
    return tstoObjectArray(arrayElementTypeOrTypes, options);
  }

  throw new Error('unknown array element type specification');
}

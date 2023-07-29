import { SubArrayElementType } from '../sub-array-element-type';
import { SimpleArrayElementTypes } from './simple-array-element-types.type';

export type MixedArrayElementTypes =
  | SimpleArrayElementTypes
  | SubArrayElementType;

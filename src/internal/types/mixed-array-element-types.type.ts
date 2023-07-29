import { SimpleArrayElementTypes } from './simple-array-element-types.type';

export type MixedArrayElementTypes =
  | SimpleArrayElementTypes
  | {
      subArrayElementType: MixedArrayElementTypes | MixedArrayElementTypes[];
    };

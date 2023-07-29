import { MixedArrayElementTypes } from './types/mixed-array-element-types.type';

export class SubArrayElementType {
  constructor(
    public subArrayElementType:
      | MixedArrayElementTypes
      | MixedArrayElementTypes[],
  ) {}

  static create(
    subArrayElementType: MixedArrayElementTypes | MixedArrayElementTypes[],
  ) {
    return new SubArrayElementType(subArrayElementType);
  }
}

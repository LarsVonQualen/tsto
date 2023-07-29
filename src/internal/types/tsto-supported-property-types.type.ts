export type TstoSupportedPrimitiveTypes = 'string' | 'number';

export type TstoSupportedPropertyTypes =
  | TstoSupportedPrimitiveTypes
  | ('object' | 'array' | 'multidimensional-array');

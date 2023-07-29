export type SupportedPrimitiveTypes = 'string' | 'number';

export type SupportedPropertyTypes =
  | SupportedPrimitiveTypes
  | ('object' | 'array' | 'multidimensional-array');

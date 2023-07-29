import { Constructor } from './constructor.type';
import { SupportedPrimitiveTypes } from './supported-property-types.type';

export type SimpleArrayElementTypes =
  | Constructor<any>
  | SupportedPrimitiveTypes;

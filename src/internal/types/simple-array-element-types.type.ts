import { Constructor } from './constructor.type';
import { TstoSupportedPrimitiveTypes } from './tsto-supported-property-types.type';

export type SimpleArrayElementTypes =
  | Constructor<any>
  | TstoSupportedPrimitiveTypes;

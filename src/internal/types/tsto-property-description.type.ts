import { TstoObjectManager } from '../tsto-object-manager';
import { TstoOptions } from './tsto-options.type';
import {
  TstoSupportedPrimitiveTypes,
  TstoSupportedPropertyTypes,
} from './tsto-supported-property-types.type';

export type TstoBaseDescription = {
  type: TstoSupportedPropertyTypes;
  childObjectManager?: TstoObjectManager<any>;
  options?: TstoOptions;
  parameterIndex?: number;
  name?: string;
  arrayElementTypes?: (Function | TstoSupportedPrimitiveTypes)[];
};

export type TstoConstructorParameterDescription = TstoBaseDescription & {
  parameterIndex: number;
};

export type TstoPropertyDescription = TstoBaseDescription & {
  name: string;
};

export type TstoDescription = TstoConstructorParameterDescription &
  TstoPropertyDescription;

import { TstoObjectManager } from '../tsto-object-manager';
import { TstoOptions } from './tsto-options.type';
import { TstoSupportedPropertyTypes } from './tsto-supported-property-types.type';

export type TstoBaseDescription = {
  type: TstoSupportedPropertyTypes;
  childObjectManager?: TstoObjectManager;
  options?: TstoOptions;
  parameterIndex?: number;
  name?: string;
};

export type TstoConstructorParameterDescription = TstoBaseDescription & {
  parameterIndex: number;
};

export type TstoPropertyDescription = TstoBaseDescription & {
  name: string;
};

export type TstoDescription = TstoConstructorParameterDescription &
  TstoPropertyDescription;

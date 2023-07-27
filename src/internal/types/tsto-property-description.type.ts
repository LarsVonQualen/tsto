import { TstoObjectManager } from '../tsto-object-manager';
import { TstoOptions } from './tsto-options.type';
import { TstoSupportedPropertyTypes } from './tsto-supported-property-types.type';

export type TstoPropertyDescription = {
  type: TstoSupportedPropertyTypes;
  childObjectManager?: TstoObjectManager;
  options?: TstoOptions;
};

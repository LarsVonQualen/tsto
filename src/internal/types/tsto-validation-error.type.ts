import { TstoSupportedPropertyTypes } from './tsto-supported-property-types.type';

export type TstoValidationError = {
  type: TstoSupportedPropertyTypes;
  path: string;
  error: string;

  childErrors?: TstoValidationError[];
};

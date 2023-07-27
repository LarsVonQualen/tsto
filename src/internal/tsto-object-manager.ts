import { TstoOptions } from './types/tsto-options.type';
import { TstoPropertyDescription } from './types/tsto-property-description.type';
import { TstoSupportedPropertyTypes } from './types/tsto-supported-property-types.type';
import { TstoValidationError } from './types/tsto-validation-error.type';

export class TstoObjectManager {
  private properties = new Map<string, TstoPropertyDescription>();

  constructor(private target: any) {}

  registerProperty(
    key: string,
    type: TstoSupportedPropertyTypes,
    childObjectManager?: TstoObjectManager,
    options?: TstoOptions,
  ) {
    this.properties.set(key, {
      type,
      childObjectManager,
      options,
    });
  }

  registerString(key: string, options?: TstoOptions) {
    this.registerProperty(key, 'string', undefined, options);
  }

  registerNumber(key: string, options?: TstoOptions) {
    this.registerProperty(key, 'number', undefined, options);
  }

  registerObject(
    key: string,
    childObjectManager: TstoObjectManager,
    options?: TstoOptions,
  ) {
    this.registerProperty(key, 'object', childObjectManager, options);
  }

  registerObjectArray(
    key: string,
    childObjectManager: TstoObjectManager,
    options?: TstoOptions,
  ) {
    this.registerProperty(key, 'object-array', childObjectManager, options);
  }

  validate(obj: object): TstoValidationError[] {
    const props = [...this.properties.entries()];

    return props.map(([key, description]) =>
      this.validateProperty(obj[key], description),
    );
  }

  from<Target>(obj: object | undefined | null): Target | undefined | null {
    if (obj === undefined) {
      return undefined;
    }

    if (obj === null) {
      return null;
    }

    const result = new this.target.constructor();
    const props = [...this.properties.entries()];

    return props
      .map(([key, description]) => ({
        key,
        value: this.getMappedValue(obj[key], description),
      }))
      .reduce((obj, { key, value }) => {
        obj[key] = value;

        return obj;
      }, result);
  }

  private validateProperty(
    rawValue: any,
    description: TstoPropertyDescription,
  ): TstoValidationError {
    return { error: '', path: '', type: 'string' };
  }

  private getMappedValue(rawValue: any, description: TstoPropertyDescription) {
    switch (description.type) {
      case 'number':
        return this.handleNumber(rawValue, description);
      case 'string':
        return this.handleString(rawValue, description);
      case 'object':
        return this.handleObject(rawValue, description);
      case 'object-array':
        return this.handleArray(rawValue, description);
      default:
        throw new Error('unknown property type');
    }
  }

  private handleNumber(rawValue: any, { options }: TstoPropertyDescription) {
    if (options?.nullable && rawValue === null) {
      return null;
    }

    if (options?.undefineable && rawValue === undefined) {
      return undefined;
    }

    return Number(rawValue);
  }

  private handleString(rawValue: any, { options }: TstoPropertyDescription) {
    if (options?.nullable && rawValue === null) {
      return null;
    }

    if (options?.undefineable && rawValue === undefined) {
      return undefined;
    }

    return String(rawValue);
  }

  private handleObject(
    rawValue: object | null | undefined,
    { options, childObjectManager }: TstoPropertyDescription,
  ) {
    if (options?.nullable && rawValue === null) {
      return null;
    }

    if (options?.undefineable && rawValue === undefined) {
      return undefined;
    }

    return childObjectManager?.from(rawValue);
  }

  private handleArray(
    rawValue: object[] | null | undefined,
    { options, childObjectManager }: TstoPropertyDescription,
  ) {
    if (options?.nullable && rawValue === null) {
      return null;
    }

    if (options?.undefineable && rawValue === undefined) {
      return undefined;
    }

    return (rawValue ?? []).map(val => childObjectManager?.from(val));
  }
}

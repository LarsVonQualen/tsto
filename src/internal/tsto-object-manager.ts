import { TstoOptions } from './types/tsto-options.type';
import {
  TstoBaseDescription,
  TstoConstructorParameterDescription,
  TstoPropertyDescription,
} from './types/tsto-property-description.type';
import { TstoSupportedPropertyTypes } from './types/tsto-supported-property-types.type';
import { TstoValidationError } from './types/tsto-validation-error.type';

export class TstoObjectManager {
  private descriptions: TstoBaseDescription[] = [];
  private constructorParameters: {
    name: string;
    parameterIndex: number;
    isPublic: boolean;
  }[] = [];

  constructor(private target: any) {}

  registerProperty(
    name: string,
    type: TstoSupportedPropertyTypes,
    childObjectManager?: TstoObjectManager,
    options?: TstoOptions,
  ) {
    this.descriptions.push({
      name,
      type,
      childObjectManager,
      options,
    });
  }

  registerConstructorParameter(
    parameterIndex: number,
    type: TstoSupportedPropertyTypes,
    childObjectManager?: TstoObjectManager,
    options?: TstoOptions,
  ) {
    this.descriptions.push({
      type,
      parameterIndex,
      options,
      childObjectManager,
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
    return this.getPropertyDescriptions().map(property =>
      this.validateProperty(property.name, property as TstoPropertyDescription),
    );
  }

  from<Target>(obj: object | undefined | null): Target | undefined | null;
  from<Target>(
    obj: object | undefined | null,
    options: { looseMapping: true },
  ): Target | undefined | null;
  from<Target>(
    obj: object | undefined | null,
    options: { looseMapping: false },
  ): [Target | undefined | null, TstoValidationError[]];
  from<Target>(
    obj: object | undefined | null,
    options?: { looseMapping: boolean },
  ):
    | (Target | undefined | null)
    | [Target | undefined | null, TstoValidationError[]] {
    return options?.looseMapping === false
      ? this.doStrictMapping<Target>(obj)
      : this.doLooseMapping<Target>(obj);
  }

  private getPropertyDescriptions(): TstoPropertyDescription[] {
    return this.descriptions
      .map(description =>
        typeof description.name === 'string'
          ? (description as TstoPropertyDescription)
          : null,
      )
      .filter(
        propertyDescription => propertyDescription !== null,
      ) as TstoPropertyDescription[];
  }

  private getConstructorParameterDescriptions(): TstoConstructorParameterDescription[] {
    return this.descriptions
      .map(description =>
        typeof description.parameterIndex === 'number'
          ? (description as TstoConstructorParameterDescription)
          : null,
      )
      .filter(
        constructorParameterDescription =>
          constructorParameterDescription !== null,
      ) as TstoConstructorParameterDescription[];
  }

  private doStrictMapping<Target>(
    obj: object | undefined | null,
  ): [Target | undefined | null, TstoValidationError[]] {
    if (obj === undefined) {
      return [undefined, []];
    }

    if (obj === null) {
      return [null, []];
    }

    const result = this.getPropertyDescriptions()
      .map(property => ({
        key: property.name,
        value: this.getMappedValue(obj[property.name], property),
      }))
      .reduce((obj, { key, value }) => {
        obj[key] = value;

        return obj;
      }, this.activateNewInstance(obj));

    return [result, []];
  }

  private doLooseMapping<Target>(
    obj: object | undefined | null,
  ): Target | undefined | null {
    if (obj === undefined) {
      return undefined;
    }

    if (obj === null) {
      return null;
    }

    return this.getPropertyDescriptions()
      .filter(prop => typeof prop.name === 'string')
      .map(property => ({
        key: property.name,
        value: this.getMappedValue(obj[property.name], property),
      }))
      .reduce((obj, { key, value }) => {
        obj[key] = value;

        return obj;
      }, this.activateNewInstance(obj));
  }

  private activateNewInstance(obj: object) {
    if (!this.target.constructor) {
      throw new Error('Unable to instantiate class');
    }

    const parameterDescriptions = this.getConstructorParameterDescriptions();

    if (!parameterDescriptions.length) {
      return new this.target.constructor();
    }

    const contructorDefinition = this.target.constructor.toString() as string;
    const CTOR_PARAMS_REGEX = /constructor\((.*)\)/;
    const matches = CTOR_PARAMS_REGEX.exec(contructorDefinition);

    if (matches && matches[1]) {
      const params = matches[1]
        .split(',')
        .map(name => name.trim())
        .map((name, parameterIndex) => ({
          name,
          parameterIndex,
          isPublic: new RegExp(`this\\.${name}\\s+=\\s+${name}`, 'm').test(
            contructorDefinition,
          ),
        }))
        .map(param => {
          if (!param.isPublic) {
            throw new Error(
              `Parameter ${param.name} in constructor of ${this.target.constructor.name} is not public. Tsto does not support private constructor parameters.`,
            );
          }

          return {
            ...param,
            value: obj[param.name],
          };
        })
        .sort((a, b) => a.parameterIndex - b.parameterIndex)
        .map(param => param.value);

      return new this.target.constructor(...params);
    }

    return new this.target.constructor();
  }

  private validateProperty(
    rawValue: any,
    description: TstoPropertyDescription,
  ): TstoValidationError {
    return { error: '', path: '', type: 'string' };
  }

  private getMappedValue(rawValue: any, property: TstoPropertyDescription) {
    switch (property.type) {
      case 'number':
        return this.handleNumber(rawValue, property);
      case 'string':
        return this.handleString(rawValue, property);
      case 'object':
        return this.handleObject(rawValue, property);
      case 'object-array':
        return this.handleArray(rawValue, property);
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

    return rawValue?.map(val => childObjectManager?.from(val)) ?? undefined;
  }
}

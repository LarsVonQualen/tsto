export type PropertyHandler = {
  name: string;
  mapper: (rawValue: any) => any;
  validator: (rawValue: any) => string[];
};
export type ConstructorParameterHandler = {
  parameterIndex: number;
  mapper: (rawValue: any) => any;
  validator: (rawValue: any) => string[];
};

export function createHandler<T>(
  parameterIndex: number,
  mapper: (rawValue?: T | null) => any,
  validator: (rawValue?: T | null) => any,
): ConstructorParameterHandler;
export function createHandler<T>(
  propertyName: string,
  mapper: (rawValue?: T | null) => any,
  validator: (rawValue?: T | null) => any,
): PropertyHandler;
export function createHandler<T>(
  propertyNameOrParameterIndex: string | number,
  mapper: (rawValue?: T | null) => any,
  validator: (rawValue?: T | null) => any,
): PropertyHandler | ConstructorParameterHandler {
  if (typeof propertyNameOrParameterIndex === 'string') {
    return {
      name: propertyNameOrParameterIndex,
      mapper,
      validator,
    };
  } else {
    return {
      parameterIndex: propertyNameOrParameterIndex,
      mapper,
      validator,
    };
  }
}

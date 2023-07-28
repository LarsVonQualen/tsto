import { getObjectManager } from './get-object-manager.fn';
import { Constructor } from './types/constructor.type';
import { TstoValidationError } from './types/tsto-validation-error.type';

export function tstoValidate<Target extends object>(
  object: object,
  to: Constructor<Target>,
): TstoValidationError[];
export function tstoValidate<Target extends object>(
  json: string,
  to: Constructor<Target>,
): TstoValidationError[];
export function tstoValidate<Target extends object>(
  jsonOrObject: object | string,
  to: Constructor<Target>,
): TstoValidationError[] {
  const objectManager = getObjectManager(to);

  if (typeof jsonOrObject === 'string') {
    const obj = JSON.parse(jsonOrObject);

    return objectManager.validate(obj);
  }

  return objectManager.validate(jsonOrObject);
}

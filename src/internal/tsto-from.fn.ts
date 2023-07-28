import { Constructor } from './types/constructor.type';
import { getObjectManager } from './get-object-manager.fn';
import { TstoValidationError } from './types/tsto-validation-error.type';

export function tstoFrom<Target extends object>(
  object: object,
  to: Constructor<Target>,
  options: { looseMapping: false },
): [Target | undefined | null, TstoValidationError[]];
export function tstoFrom<Target extends object>(
  object: object,
  to: Constructor<Target>,
  options: { looseMapping: true },
): Target | undefined | null;
export function tstoFrom<Target extends object>(
  object: object,
  to: Constructor<Target>,
): Target | undefined | null;
export function tstoFrom<Target extends object>(
  object: object,
  to: Constructor<Target>,
  options?: { looseMapping: boolean },
):
  | (Target | undefined | null)
  | [Target | undefined | null, TstoValidationError[]] {
  const objectManager = getObjectManager(to);

  if (!options) {
    return objectManager.from<Target>(object);
  } else if (options.looseMapping === true) {
    return objectManager.from<Target>(object, {
      looseMapping: true,
    });
  } else {
    return objectManager.from<Target>(object, {
      looseMapping: false,
    });
  }
}

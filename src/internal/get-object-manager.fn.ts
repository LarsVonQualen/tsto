import 'reflect-metadata';
import { ObjectManager } from './object-manager';
import { Constructor } from './types/constructor.type';
import { PROTOTYPE_KEY } from './types/prototype-key.const';

export function getObjectManager<Target>(
  target: Constructor<Target> | Constructor<Target>['prototype'],
) {
  const objectManagerTarget = (target?.prototype ?? target)?.constructor;

  if (!objectManagerTarget) {
    throw new Error('unknown target cant find constructor');
  }

  const existingObjectManager = objectManagerTarget[PROTOTYPE_KEY];

  if (!existingObjectManager) {
    const newObjectManager = new ObjectManager<Target>(objectManagerTarget);

    objectManagerTarget[PROTOTYPE_KEY] = newObjectManager;
  }

  const objectManager = objectManagerTarget[
    PROTOTYPE_KEY
  ] as ObjectManager<Target>;

  return objectManager;
}

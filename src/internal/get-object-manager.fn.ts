import { TstoObjectManager } from './tsto-object-manager';
import { Constructor } from './types/constructor.type';

export function getObjectManager<Target>(
  target: Constructor<Target> | Constructor<Target>['prototype'],
) {
  const proto = target?.prototype ?? target;

  if (!proto.__tsto) {
    proto.__tsto = new TstoObjectManager(proto);
  }

  return proto.__tsto as TstoObjectManager<Target>;
}

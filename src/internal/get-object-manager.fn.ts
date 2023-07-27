import { TstoObjectManager } from './tsto-object-manager';

export function getObjectManager(target: any) {
  const proto = target.prototype ?? target.constructor.prototype;

  if (!proto.__tsto) {
    proto.__tsto = new TstoObjectManager(target);
  }

  return proto.__tsto as TstoObjectManager;
}

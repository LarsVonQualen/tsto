import { getObjectManager } from '../get-object-manager.fn';
import { createStringMapper } from '../mappers/create-string-mapper.fn';
import { Options } from '../types/options.type';

export function stringDecorator(options?: Options) {
  const opts: Options = {
    nullable: true,
    undefineable: true,
    ...(options ?? {}),
  };
  const mapper = createStringMapper(opts);

  return (target: any, key?: string, parameterIndex?: any) => {
    getObjectManager(target).registerHandler(mapper, key, parameterIndex);
  };
}

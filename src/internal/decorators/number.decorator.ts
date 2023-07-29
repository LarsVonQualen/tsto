import { getObjectManager } from '../get-object-manager.fn';
import { createNumberMapper } from '../mappers/create-number-mapper.fn';
import { Options } from '../types/options.type';

export function numberDecorator(options?: Options) {
  const opts: Options = {
    nullable: true,
    undefineable: true,
    ...(options ?? {}),
  };
  const mapper = createNumberMapper(opts);

  return (target: any, key?: string, parameterIndex?: any) => {
    getObjectManager(target).registerHandler(mapper, key, parameterIndex);
  };
}

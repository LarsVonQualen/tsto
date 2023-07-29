import { getObjectManager } from '../get-object-manager.fn';
import { createEnumMapper } from '../mappers/create-enum-mapper.fn';
import { Options } from '../types/options.type';
import { StandardEnum } from '../types/standard-enum';

export function enumDecorator<TEnumType extends StandardEnum<unknown>>(
  enumType: TEnumType,
  options?: Options & {
    useStringsAsInput?: boolean;
  },
) {
  const opts: Options = {
    nullable: true,
    undefineable: true,
    ...(options ?? {}),
  };
  const mapper = createEnumMapper(enumType, opts);

  return (target: any, key?: string, parameterIndex?: any) => {
    getObjectManager(target).registerHandler(mapper, key, parameterIndex);
  };
}

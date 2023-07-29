import { Options } from '../types/options.type';

export function createNumberMapper(options: Options) {
  return (rawValue?: number | null) => {
    if (options.nullable === true && rawValue === null) {
      return null;
    }

    if (options.undefineable === true && rawValue === undefined) {
      return undefined;
    }

    return Number(rawValue ?? 0);
  };
}

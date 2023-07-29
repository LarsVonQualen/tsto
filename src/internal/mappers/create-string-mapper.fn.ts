import { Options } from '../types/options.type';

export function createStringMapper(options: Options) {
  return (rawValue?: string | null) => {
    if (options.nullable === true && rawValue === null) {
      return null;
    }

    if (options.undefineable === true && rawValue === undefined) {
      return undefined;
    }

    return String(rawValue ?? '');
  };
}

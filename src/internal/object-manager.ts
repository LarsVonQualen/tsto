import {
  ConstructorParameterHandler,
  createHandler,
  PropertyHandler,
} from './create-handler.fn';
import { Constructor } from './types/constructor.type';

export class ObjectManager<Target> {
  public propertyHandlers: PropertyHandler[] = [];
  public constructorParameterHandlers: ConstructorParameterHandler[] = [];

  constructor(private target: Constructor<Target>) {}

  registerHandler<T>(
    mapper: (rawValue?: T | null) => any,
    key?: string,
    parameterIndex?: any,
  ) {
    if (key !== undefined) {
      const handler = createHandler(key, mapper);

      this.propertyHandlers.push(handler);
    } else {
      const handler = createHandler(parameterIndex, mapper);

      this.constructorParameterHandlers.push(handler);
    }
  }

  from(obj?: object | null) {
    if (obj === undefined) {
      return undefined;
    }

    if (obj === null) {
      return null;
    }

    return this.propertyHandlers
      .map(handler => ({
        key: handler.name,
        value: handler.mapper(obj[handler.name]),
      }))
      .reduce((target, { key, value }) => {
        target[key] = value;

        return target;
      }, this.createNewTargetInstance(obj));
  }

  private createNewTargetInstance(obj: object) {
    const ctor = this.target;

    if (!ctor) {
      throw new Error(
        'Unable to instantiate target does not have a constructor',
      );
    }

    if (this.constructorParameterHandlers.length === 0) {
      return new ctor();
    }

    const contructorDefinition = ctor.toString() as string;
    const CTOR_PARAMS_REGEX = /constructor\((.*)\)/;
    const matches = CTOR_PARAMS_REGEX.exec(contructorDefinition);

    if (matches && matches[1]) {
      const params = matches[1]
        .split(',')
        .map(name => name.trim())
        .map((name, parameterIndex) => ({
          name,
          parameterIndex,
          isPublic: new RegExp(`this\\.${name}\\s+=\\s+${name}`, 'm').test(
            contructorDefinition,
          ),
        }))
        .map(param => {
          if (!param.isPublic) {
            throw new Error(
              `Parameter ${param.name} in constructor of ${ctor.name} is not public. Tsto does not support private constructor parameters.`,
            );
          }

          return {
            ...param,
            value: obj[param.name],
          };
        })
        .sort((a, b) => a.parameterIndex - b.parameterIndex)
        .map(
          param =>
            this.getConstructorParameterHandler(param.parameterIndex)?.mapper(
              param.value,
            ),
        );

      return new ctor(...params);
    }

    return new ctor();
  }

  private getConstructorParameterHandler(parameterIndex: number) {
    return this.constructorParameterHandlers.find(
      handler => handler.parameterIndex === parameterIndex,
    );
  }
}

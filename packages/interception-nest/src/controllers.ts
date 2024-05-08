import 'reflect-metadata';
import { decorate, type ClassType } from '@aop-ts/interception';

/**
 * @experimental
 */
export function decorateController<TDecoratee, TInterceptor>(
  Decoratee: ClassType<TDecoratee>,
  Interceptor: ClassType<TInterceptor>,
): ClassType<TDecoratee> {
  const Decorated = decorate(Decoratee);

  const classMetadataKeys = Reflect.getMetadataKeys(Decoratee);

  for (const key of classMetadataKeys) {
    const value = Reflect.getMetadata(key, Decoratee);
    Reflect.defineMetadata(key, value, Decorated);
  }

  const methodNames: string[] = Object.getOwnPropertyNames(Decoratee.prototype).filter(
    (name) => typeof Decorated.prototype[name] === 'function',
  );

  for (const methodName of methodNames) {
    const keysPerProperty = Reflect.getMetadataKeys(Decoratee, methodName);
    for (const key of keysPerProperty) {
      const value = Reflect.getMetadata(key, Decoratee, methodName);
      Reflect.defineMetadata(key, value, Decorated, methodName);
      const prototypeValue = Reflect.getMetadata(key, Decoratee.prototype, methodName);
      Reflect.defineMetadata(key, prototypeValue, Decorated.prototype, methodName);
    }
    const keysPerPrototypeMethod = Reflect.getMetadataKeys(Decoratee.prototype[methodName]);
    for (const key of keysPerPrototypeMethod) {
      const value = Reflect.getMetadata(key, Decoratee.prototype[methodName]);
      Reflect.defineMetadata(key, value, Decorated.prototype[methodName]);
    }
  }

  const overridenDesignParams = [Decoratee, Interceptor];
  Reflect.defineMetadata('design:paramtypes', overridenDesignParams, Decorated);

  return Decorated;
}

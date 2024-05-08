import { decorate } from '@aop-ts/interception';
import 'reflect-metadata';

/**
 * Creates a provider object consumable by Nest's `@Module` decorator.
 *
 * Under the hood, it makes use of the {@link decorate} function from the core package; however,
 * it also connects the generated decorator class to the dependency injection system by telling Nest
 * how to instantiate it.
 *
 * @see {@link decorate}
 * @param Injectable The class to be decorated. Should be Nest's `@Injectable`.
 * @param Interceptor  The class implementing the {@link Interceptor} interface. Should be Nest's
 * `@Injectable`.
 * @returns Provider object for Nest's `@Module`.
 */
export const provide = (Injectable: any, Interceptor: any) => {
  const paramTypes = Reflect.getMetadata('design:paramtypes', Injectable);
  return {
    provide: Injectable,
    useFactory: (...args: any[]) => {
      const interceptor = args[0];
      const injectableParams = args.slice(1);
      const InjectableDecorator = decorate(Injectable);
      return new InjectableDecorator(new Injectable(...injectableParams), interceptor);
    },
    inject: [Interceptor, ...paramTypes],
  };
};

import { Interceptor } from './interception-types';
import { ClassType } from './utility-types';

/**
 * Generates a new class with its methods decorated with calls to an interceptor (described below).
 *
 * The new class must be then instantited with exactly two arguments—the original (decoratee) class,
 * and the interceptor class.
 *
 * An interceptor is a class implementing the `Interceptor` interface—specifically, the single
 * method `intercept`.
 *
 * By implementing this method, the implementors gain the ability to control original
 * (that is, `Decoratee`s') calls on a fine-grained level; for example, they can:
 *
 * - Perform additional actions before the original invocation;
 * - Perform additional actions after the original invocation—
 *   - either immediately after the invocation or later, having `await`ed it—in the case of
 * returning a `Promise`;
 * - Read and modify the passed arguments;
 * - Read and modify the final result.
 *
 * @param {ClassType<TDecoratee>} decoratee The class to be decorated.
 * @returns {ClassType<TDecoratee>} The generated decorated class.
 */
export function decorate<TDecoratee>(decoratee: ClassType<TDecoratee>): ClassType<TDecoratee> {
  const targetClass = decoratee;
  const Decorator = class GeneratedDecorator {
    constructor(
      public readonly decoratee: TDecoratee,
      public readonly interceptor: Interceptor<TDecoratee>,
    ) {}
  };

  const methodNames: string[] = Object.getOwnPropertyNames(targetClass.prototype).filter(
    (name) => typeof targetClass.prototype[name] === 'function' && name !== 'constructor',
  );

  for (const name of methodNames) {
    const callDecoratorFunction = function (
      this: InstanceType<typeof Decorator>,
      ...originalArgs: any[]
    ): any {
      const decoratee = this.decoratee as any;
      const proceed = () => {
        return decoratee[name](...originalArgs);
      };
      const proceedWith = (...args: any) => {
        return decoratee[name](...args);
      };
      const method = targetClass.prototype[name];
      const invocation = {
        name,
        proceed,
        proceedWith,
        method,
        args: originalArgs,
        class: targetClass,
      };
      const result = this.interceptor.intercept(invocation as any);
      return result;
    };

    const prototype = Decorator.prototype as any;
    prototype[name] = callDecoratorFunction;
  }

  return Decorator as any;
}

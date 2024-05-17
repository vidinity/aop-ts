import type { Interceptor, Invocation, Result, ResultAsync } from './interception-types';

export type AsyncInvocation<TDecoratee> = Omit<
  Invocation<TDecoratee>,
  'proceed' | 'proceedWith'
> & {
  result: ResultAsync<TDecoratee>;
};

/**
 * @experimental
 */
export class AsyncInterceptor<TDecoratee> implements Interceptor<TDecoratee> {
  intercept(invocation: Invocation<TDecoratee>): Result<TDecoratee> {
    const { args, class: class_, method, name } = invocation;

    const result = this.interceptAll(invocation);

    const isResultPromise = typeof (result as any)?.then === 'function';
    if (isResultPromise) {
      const resultAsync = result as ResultAsync<TDecoratee>;
      const asyncInvocation = {
        args,
        class: class_,
        method,
        name,
        result: resultAsync,
      } as AsyncInvocation<TDecoratee>;
      return this.interceptAsync(asyncInvocation) as any;
    }

    return result;
  }

  interceptAll(invocation: Invocation<TDecoratee>): Result<TDecoratee> {
    return invocation.proceed();
  }

  interceptAsync(invocation: AsyncInvocation<TDecoratee>): ResultAsync<TDecoratee> {
    return invocation.result;
  }
}

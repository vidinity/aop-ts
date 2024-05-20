import type {
  Interceptor,
  Invocation,
  Result,
  ResultAsync,
  ResultPlain,
} from './interception-types';

/**
 * @experimental
 */
export type UnproceedableInvocation<TDecoratee> = Omit<
  Invocation<TDecoratee>,
  'proceed' | 'proceedWith'
>;

/**
 * @experimental
 */
export type AfterAsyncInvocation<TDecoratee> = UnproceedableInvocation<TDecoratee> & {
  result: ResultAsync<TDecoratee>;
};

/**
 * @experimental
 */
export type AfterSyncInvocation<TDecoratee> = UnproceedableInvocation<TDecoratee> & {
  result: ResultPlain<TDecoratee>;
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
      } as AfterAsyncInvocation<TDecoratee>;
      return this.interceptAfterAsync(asyncInvocation);
    }

    const resultSync = result as ResultPlain<TDecoratee>;
    const syncInvocation = {
      args,
      class: class_,
      method,
      name,
      result: resultSync,
    } as AfterSyncInvocation<TDecoratee>;
    return this.interceptAfterSync(syncInvocation);
  }

  protected interceptAll(invocation: Invocation<TDecoratee>): Result<TDecoratee> {
    return invocation.proceed();
  }

  protected interceptAfterAsync(
    invocation: AfterAsyncInvocation<TDecoratee>,
  ): ResultAsync<TDecoratee> {
    return invocation.result;
  }

  protected interceptAfterSync(
    invocation: AfterSyncInvocation<TDecoratee>,
  ): ResultPlain<TDecoratee> {
    return invocation.result;
  }
}

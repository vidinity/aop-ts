import { decorate } from './functions';
import { AsyncInterceptor } from './async-interceptor';
import type { AfterAsyncInvocation, AfterSyncInvocation } from './async-interceptor';

import type { ClassType } from './utility-types';
import type { DecoratorClass, Interceptor, Invocation, Result } from './interception-types';

export { decorate, AsyncInterceptor };
export type {
  DecoratorClass,
  Interceptor,
  Invocation,
  Result,
  ClassType,
  AfterAsyncInvocation,
  AfterSyncInvocation,
};

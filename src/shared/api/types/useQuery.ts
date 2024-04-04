import { UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';

import { BaseError } from './base';
import { Any } from '../../utils';

type FuncParams<TFetchReturn extends (...args: Any) => Any> = Parameters<TFetchReturn>[0];

type AnyPromiseFn = (...args: Any) => Promise<Any>;
type QueryKey = [string, Record<string, unknown>?];

export type ReturnAwaited<TFetchReturn extends AnyPromiseFn> = Awaited<ReturnType<TFetchReturn>>;

export type QueryOptions<
  TFetchFn extends AnyPromiseFn,
  TData = Awaited<ReturnType<TFetchFn>>,
  TQueryFnData = Awaited<ReturnType<TFetchFn>>,
  TError = BaseError,
> = Omit<UseQueryOptions<TQueryFnData, TError, TData, QueryKey>, 'queryKey' | 'queryFn'>;

export type MutationOptions<TFetchReturn extends (...args: Any) => Any> = Omit<
  UseMutationOptions<Awaited<ReturnType<TFetchReturn>>, BaseError, FuncParams<TFetchReturn>>,
  'queryKey' | 'queryFn'
>;

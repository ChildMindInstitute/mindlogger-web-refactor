import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query"

import { BaseError } from "./base"

type FuncParams<TFetchReturn extends (...args: any) => any> = Parameters<TFetchReturn>[0]

type AnyPromiseFn = (...args: any) => Promise<any>
type QueryKey = [string, Record<string, unknown>?]

export type ReturnAwaited<TFetchReturn extends AnyPromiseFn> = Awaited<ReturnType<TFetchReturn>>

export type QueryOptions<
  TFetchFn extends AnyPromiseFn,
  TData = Awaited<ReturnType<TFetchFn>>,
  TQueryFnData = Awaited<ReturnType<TFetchFn>>,
  TError = BaseError,
> = Omit<UseQueryOptions<TQueryFnData, TError, TData, QueryKey>, "queryKey" | "queryFn">

export type MutationOptions<TFetchReturn extends (...args: any) => any> = Omit<
  UseMutationOptions<Awaited<ReturnType<TFetchReturn>>, BaseError, FuncParams<TFetchReturn>>,
  "queryKey" | "queryFn"
>

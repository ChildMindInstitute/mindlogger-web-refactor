import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query"

import { BaseError } from "./base"

type FuncParams<TFetchReturn extends (...args: any) => any> = Parameters<TFetchReturn>[0]

export type QueryOptions<TFetchReturn extends (...args: any) => any> = Omit<
  UseQueryOptions<Awaited<ReturnType<TFetchReturn>>, BaseError>,
  "queryKey" | "queryFn"
>

export type MutationOptions<TFetchReturn extends (...args: any) => any> = Omit<
  UseMutationOptions<Awaited<ReturnType<TFetchReturn>>, BaseError, FuncParams<TFetchReturn>>,
  "queryKey" | "queryFn"
>

import { appletService, QueryOptions, useBaseQuery } from "~/shared/api"

type Options = QueryOptions<typeof appletService.getAll>

export const useAppletListQuery = (options?: Options) => {
  return useBaseQuery(["appletList"], appletService.getAll, { ...options })
}

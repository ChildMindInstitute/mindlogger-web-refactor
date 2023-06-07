import { appletService, QueryOptions, useBaseQuery } from "~/shared/api"

type Params = {
  userId: string
}
type Options = QueryOptions<typeof appletService.getAll>

export const useAppletListQuery = (params: Params, options?: Options) => {
  return useBaseQuery([`appletList/${params.userId}`], appletService.getAll, { ...options })
}

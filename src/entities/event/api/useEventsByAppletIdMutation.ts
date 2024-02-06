import { eventsService, MutationOptions, useBaseMutation } from "~/shared/api"

type FetchFn = typeof eventsService.getEventsByAppletId
type Options = MutationOptions<FetchFn>

export const useEventsByAppletIdMutation = (options?: Options) => {
  return useBaseMutation([`eventsByAppletId`], eventsService.getEventsByAppletId, {
    ...options,
  })
}

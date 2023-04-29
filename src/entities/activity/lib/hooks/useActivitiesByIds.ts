import { useMemo } from "react"

import { useActivitiesByIdsQuery } from "../../api"

import { AppletDetailsDTO } from "~/shared/api"

type Props = {
  appletDetails: AppletDetailsDTO
}

export const useActivitiesByIds = ({ appletDetails }: Props) => {
  const activitiesIds = useMemo(() => {
    return appletDetails.activities.map(x => x.id)
  }, [appletDetails])

  const queryResults = useActivitiesByIdsQuery({ activitiesIds })

  const { isError, isLoading, data } = useMemo(() => {
    const isLoading = queryResults.reduce((acc, item) => {
      return item.isLoading || acc
    }, false)

    const isError = queryResults.reduce((acc, item) => {
      return item.isError || acc
    }, false)

    const data = queryResults.map(item => item.data?.data?.result)

    return {
      isError,
      isLoading,
      data,
    }
  }, [queryResults])

  return {
    isError,
    isLoading,
    data,
  }
}

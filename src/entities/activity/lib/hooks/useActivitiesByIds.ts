import { useMemo } from 'react';

import { useActivitiesByIdsQuery } from '../../api';

type Props = {
  ids: Array<string>;
  enabled?: boolean;
  isPublic: boolean;
};

export const useActivitiesByIds = ({ ids, enabled, isPublic }: Props) => {
  const queryResults = useActivitiesByIdsQuery({ ids, enabled, isPublic });
  const { isError, isLoading, data } = useMemo(() => {
    const isLoading = queryResults.some((item) => item.isLoading);
    const isError = queryResults.some((item) => item.isError);

    const data = queryResults.map((item) => item.data?.data?.result);

    return {
      isError,
      isLoading,
      data,
    };
  }, [queryResults]);

  return {
    isError,
    isLoading,
    data,
  };
};

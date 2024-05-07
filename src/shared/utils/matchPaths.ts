import { matchPath } from 'react-router-dom';

type Params = {
  end?: boolean;
  caseSensitive?: boolean;
};

export const matchPaths = (
  patterns: string[],
  pathname: string,
  params: Params = { end: false, caseSensitive: false },
) => {
  return patterns.map((path) =>
    matchPath(
      {
        path,
        ...params,
      },
      pathname,
    ),
  );
};

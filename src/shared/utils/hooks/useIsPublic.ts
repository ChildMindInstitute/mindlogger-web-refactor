import { useParams } from 'react-router-dom';

import { booleanStringToBoolean } from '../convert/string/toBoolean';

export const useIsPublic = () => {
  const { isPublic } = useParams();

  return isPublic ? booleanStringToBoolean(isPublic) : false;
};

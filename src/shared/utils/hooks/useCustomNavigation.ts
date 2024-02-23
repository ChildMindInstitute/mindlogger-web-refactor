import { NavigateFunction, useNavigate } from 'react-router-dom';

type UseCustomNavigationReturn = {
  navigate: NavigateFunction;
  goBack: () => void;
};

export const useCustomNavigation = (): UseCustomNavigationReturn => {
  const navigate = useNavigate();

  const goBack = () => {
    return navigate(-1);
  };

  return {
    navigate,
    goBack,
  };
};

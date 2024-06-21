import { useContext } from 'react';

import { SurveyContext } from '~/features/PassSurvey';

export const ProcessingScreen = () => {
  const context = useContext(SurveyContext);

  console.log(context);

  return (
    <div>
      <h1>Survey Answer Processing</h1>
    </div>
  );
};

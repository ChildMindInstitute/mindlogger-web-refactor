import { useSearchParams } from 'react-router-dom';

function SurveyAnswerProcessing() {
  const [searchParams] = useSearchParams();

  console.log('Full search result:', searchParams);
  console.log(`AppletId: ${searchParams.get('appletId')}`);

  return <div>Survey Answer Processing Screen</div>;
}

export default SurveyAnswerProcessing;

type Props = {
  appletId: string;
  activityId: string;
  eventId: string;

  flowId: string | null;
  publicAppletKey: string | null;
};

function SurveyAnswerProcessingWidget(props: Props) {
  console.log(props);

  return <div> survey answer processing widget</div>;
}

export default SurveyAnswerProcessingWidget;

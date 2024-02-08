import { useParams } from 'react-router-dom';

import { ActivityGroups } from '~/widgets/ActivityGroups';

function PublicJoinPage() {
  const { joinLinkKey } = useParams();

  if (!joinLinkKey) {
    return (
      <div className="applet-error">
        You have reached this URL in error. Please reach out to the organizer of this applet for further assistance.
      </div>
    );
  }

  return <ActivityGroups isPublic={true} publicAppletKey={joinLinkKey} />;
}

export default PublicJoinPage;

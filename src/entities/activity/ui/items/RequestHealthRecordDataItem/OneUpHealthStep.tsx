import { FC, useContext, useEffect, useRef, useState } from 'react';

import { useOneUpHealthTokenQuery } from '~/entities/activity/api';
import { useGroupProgressRecord } from '~/entities/applet/model/hooks';
import { SurveyContext } from '~/features/PassSurvey';
import { Box } from '~/shared/ui';
import Loader from '~/shared/ui/Loader';

export const OneUpHealthStep: FC = () => {
  const { appletId } = useContext(SurveyContext);

  const { eventId, targetSubject, entityId } = useContext(SurveyContext);
  const groupProgress = useGroupProgressRecord({
    entityId,
    eventId,
    targetSubjectId: targetSubject?.id ?? null,
  });
  const submitId = groupProgress?.submitId;

  // Fetch the token using our custom hook
  const { data, isLoading } = useOneUpHealthTokenQuery({ appletId, submitId });
  const accessToken = data?.data?.result?.accessToken;

  // Instantiate channel and iframeRef variable
  const messageChannelRef = useRef<MessageChannel>();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  useEffect(() => {
    if (!accessToken || !iframeRef.current?.contentWindow || !isIframeLoaded) return;

    // Initialize message channel only when we have both the token and the iframe is ready
    const setupMessageChannel = () => {
      if (!iframeRef.current) return;

      // Initialize the message channel
      messageChannelRef.current = new window.MessageChannel();

      const targetWindow = iframeRef.current.contentWindow;
      const targetOrigin = new URL(iframeRef.current.src).origin;

      // Send the MessageChannel port to the IFrame
      targetWindow?.postMessage('', targetOrigin, [messageChannelRef.current.port2]);

      // Get the secure data with the access token from the API
      const secureDataPacket = {
        jwt: accessToken,
      };

      // Send the data through the message channel
      try {
        messageChannelRef.current.port1.postMessage(secureDataPacket);
      } catch (e) {
        console.error(`Error encountered sending secure data to iframe: ${e}`);
      }
    };

    setupMessageChannel();
  }, [accessToken, isIframeLoaded]);

  return (
    <>
      <iframe
        style={{
          border: 0,
          width: '100%',
          height: '700px',
          marginTop: '-80px',
          marginBottom: '-80px',
          maxHeight: 'calc(100vh - 120px)',
          boxShadow: '0 4px 4px 0 #00000040',
          visibility: isLoading ? 'hidden' : 'visible',
        }}
        id="system-search-iframe"
        src="https://system-search.1up.health/search"
        ref={iframeRef}
        onLoad={() => setIsIframeLoaded(true)}
      />
      {isLoading && (
        <Box position="absolute" top={0} left={0} right={0} bottom={0}>
          <Loader />
        </Box>
      )}
    </>
  );
};

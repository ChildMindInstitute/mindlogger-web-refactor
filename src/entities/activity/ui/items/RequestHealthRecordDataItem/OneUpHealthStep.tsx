import { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { useOneUpHealthTokenQuery } from '~/entities/activity/api';
import { useGroupProgressRecord } from '~/entities/applet/model/hooks';
import { SurveyContext } from '~/features/PassSurvey';
import { BaseError } from '~/shared/api';
import { Box } from '~/shared/ui';
import Loader from '~/shared/ui/Loader';

type OneUpHealthErrorType =
  | 'geographicRestriction'
  | 'tokenExpired'
  | 'serviceUnavailable'
  | 'communicationError'
  | 'unknown';

type OneUpHealthErrorConfig = {
  check: (err: BaseError) => boolean;
  title: string;
  message: string;
  banner: string;
  logMessage: string;
};

/**
 * Displays an iframe interface provided by 1UpHealth, which allows the user to search for a
 * 3rd-party health system they are part of and consent to share their health data.
 *
 * The access token, provided by the BE (which in turn calls the 1UpHealth API to generate the
 * token), is based on the submission ID associated with this assessment. This is used to
 * authenticate the user and activate the 1UpHealth iframe.
 *
 * This iframe implementation is based on the sample code provided by 1UpHealth. More information:
 * https://docs.1up.health/help-center/Content/en-US/connect-patient/system-search-api.html#embed-the-system-search-tool-iframe-and-function-for-react
 */
export const OneUpHealthStep: FC = () => {
  const { t } = useTranslation();

  const { appletId, eventId, targetSubject, entityId, activityId } = useContext(SurveyContext);
  const groupProgress = useGroupProgressRecord({
    entityId,
    eventId,
    targetSubjectId: targetSubject?.id ?? null,
  });
  const submitId = groupProgress?.submitId;

  // Fetch the token using our custom hook

  const { data, isLoading, error } = useOneUpHealthTokenQuery(
    { appletId, submitId, activityId },
    { refetchOnWindowFocus: false },
  );
  const [accessToken, setAccessToken] = useState<string | undefined>();
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | undefined>();

  useEffect(() => {
    if (data?.data?.result) {
      setAccessToken(data.data.result.accessToken);
      setRefreshTokenValue(data.data.result.refreshToken);
    }
  }, [data]);

  // Instantiate channel and iframeRef variable
  const messageChannelRef = useRef<MessageChannel>();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  const errorTypes: Record<OneUpHealthErrorType, OneUpHealthErrorConfig> = useMemo(
    () => ({
      geographicRestriction: {
        check: (err: BaseError) =>
          err?.status === 502 && (err?.evaluatedMessage ?? '').includes('within the United States'),
        title: t('oneUpHealth.geographicRestriction.title'),
        message: t('oneUpHealth.geographicRestriction.message'),
        banner: t('oneUpHealth.geographicRestriction.banner'),
        logMessage: 'Detected geographic restriction error',
      },
      tokenExpired: {
        check: (err: BaseError) =>
          err?.status === 502 && (err?.evaluatedMessage ?? '').includes('token has expired'),
        // Since we're not actually showing a banner for this error, we just return empty strings
        title: '',
        message: '',
        banner: '',
        logMessage: 'Token expired error',
      },
      serviceUnavailable: {
        check: (err: BaseError) =>
          err?.status === 502 && (err?.evaluatedMessage ?? '').includes('currently unavailable'),
        title: t('oneUpHealth.serviceUnavailable.title'),
        message: t('oneUpHealth.serviceUnavailable.message'),
        banner: t('oneUpHealth.serviceUnavailable.banner'),
        logMessage: 'Service unavailable error',
      },
      communicationError: {
        check: () => false, // This is set manually, not checked
        title: t('oneUpHealth.communicationError.title'),
        message: t('oneUpHealth.communicationError.message'),
        banner: t('oneUpHealth.communicationError.banner'),
        logMessage: 'Communication error with iframe',
      },
      unknown: {
        check: () => true, // Default fallback
        title: t('oneUpHealth.unknownError.title'),
        message: t('oneUpHealth.unknownError.message'),
        banner: t('oneUpHealth.unknownError.banner'),
        logMessage: 'Unknown 1UpHealth error',
      },
    }),
    [t],
  );
  const [errorType, setErrorType] = useState<OneUpHealthErrorType | null>(null);

  // Determine error type from error object
  const determineErrorType = useCallback(
    (err: BaseError): OneUpHealthErrorType => {
      for (const [type, config] of Object.entries(errorTypes)) {
        if (type !== 'unknown' && type !== 'communicationError' && config.check(err)) {
          return type as OneUpHealthErrorType;
        }
      }
      return 'unknown' as OneUpHealthErrorType;
    },
    [errorTypes],
  );

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
          height: '710px',
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

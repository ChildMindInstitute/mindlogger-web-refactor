import doctor from '~/assets/doctor-lilac-large.png';
import { ROUTES } from '~/shared/constants';
import { MuiModal } from '~/shared/ui';
import Box from '~/shared/ui/Box';
import { useCustomNavigation, useCustomTranslation } from '~/shared/utils';

/**
 * A public interstitial page that intercepts EHR redirects and provides a place for the user to
 * perform an explicit interaction, which is necessary for utilising a deep link to the mobile app.
 * @constructor
 */
export const EHRRedirectInterstitialPage = () => {
  const { t } = useCustomTranslation({ keyPrefix: 'ehrRedirectModal' });
  const { navigate } = useCustomNavigation();
  return (
    <Box
      display="flex"
      flex={1}
      justifyContent="center"
      alignItems="center"
      textAlign="center"
      style={{
        backgroundColor: '#D69AB8',
        backgroundImage: `url(${doctor})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <MuiModal
        isOpen={true}
        title={t('title')}
        label={t('label')}
        footerPrimaryButton={t('primaryAction')}
        onPrimaryButtonClick={() => {
          // Open the Android app. This won't work for iOS, so the iOS app will have to intercept
          // and handle the `/ehr-complete` route itself.
          window.location.replace(
            window.location.origin + ROUTES.activeAssessment.path + window.location.search,
          );
        }}
        footerSecondaryButton={t('secondaryAction')}
        onSecondaryButtonClick={() => {
          // Continue in the web app
          navigate(ROUTES.activeAssessment.path + window.location.search, {
            replace: true,
          });
        }}
      />
    </Box>
  );
};

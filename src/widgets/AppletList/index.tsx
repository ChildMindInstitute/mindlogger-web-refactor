import { AppletList, mapToAppletList, useAppletListQuery } from '~/entities/applet';
import { userModel } from '~/entities/user';
import { Box } from '~/shared/ui';
import { Text } from '~/shared/ui';
import Loader from '~/shared/ui/Loader';
import { useCustomTranslation } from '~/shared/utils';

export const AppletListWidget = () => {
  const { t } = useCustomTranslation();
  const { user } = userModel.hooks.useUserState();

  const {
    data: applets,
    isLoading,
    isError,
    error,
  } = useAppletListQuery(
    { userId: user.id ?? '' },
    {
      select: (data) => mapToAppletList(data?.data?.result),
    },
  );

  const isAppletsEmpty = !applets?.length;

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <Box display="flex" flex={1} alignItems="center" justifyContent="center">
        <span>{error.evaluatedMessage}</span>
      </Box>
    );
  }

  if (isAppletsEmpty) {
    return (
      <Box display="flex" flex={1} alignItems="center" justifyContent="center">
        <Text variant="body1">{t('noApplets')}</Text>
      </Box>
    );
  }

  return <AppletList applets={applets} />;
};

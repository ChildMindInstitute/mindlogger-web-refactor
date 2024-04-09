import ActivityDefaultIcon from '~/assets/activity-default-icon.svg';
import ActivityFlowDefaultIcon from '~/assets/activity-flow-default-icon.svg';
import { Box } from '~/shared/ui';
import { AvatarBase } from '~/shared/ui';

type Props = {
  isFlow: boolean;
  src: string | null;
};

export const ActivityCardIcon = (props: Props) => {
  const defaultImage = props.isFlow ? ActivityFlowDefaultIcon : ActivityDefaultIcon;

  const isSrcExist = props.src && props.src !== '';

  const imageSrc = isSrcExist ? props.src : defaultImage;

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="64px"
      data-testid={props.isFlow ? 'flow-card-image' : 'activity-card-image'}
    >
      <AvatarBase src={imageSrc} name="" width="64px" height="64px" />
    </Box>
  );
};

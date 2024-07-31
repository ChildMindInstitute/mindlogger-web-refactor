import Avatar from '@mui/material/Avatar';

import { useCustomMediaQuery } from '../../../utils';

type Props = {
  src: string;

  width?: string;
  height?: string;

  borderRadius?: string;
};

export const SelectBaseImage = (props: Props) => {
  const { lessThanSM } = useCustomMediaQuery();

  const defaultWidth = lessThanSM ? '44px' : '64px';
  const defaultHeight = lessThanSM ? '44px' : '64px';

  return (
    <Avatar
      src={props.src}
      sx={{
        width: props.width ?? defaultWidth,
        height: props.height ?? defaultHeight,
        borderRadius: props.borderRadius,
      }}
      variant="rounded"
      data-testid="select-image"
    />
  );
};

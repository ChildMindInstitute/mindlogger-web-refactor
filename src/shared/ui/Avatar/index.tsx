import Avatar from '@mui/material/Avatar';

import { getInitials } from '../../utils';

type Props = {
  src?: string | null;
  name?: string;

  borderRadius?: string;
  width?: string;
  height?: string;
  variant?: 'circular' | 'rounded' | 'square';
  testid?: string;
  backgroundColor?: string;
};

export const AvatarBase = ({
  src,
  name,
  width = '32px',
  height = '32px',
  variant = 'circular',
  testid,
  borderRadius,
  backgroundColor,
}: Props) => {
  const avatarOptions = (name?: string, src?: string | null) => {
    if (src) {
      return {
        src,
      };
    }

    return {
      children: getInitials(name),
    };
  };

  return (
    <Avatar
      {...avatarOptions(name, src)}
      alt={`${name} image`}
      sx={{ width, height, borderRadius, backgroundColor }}
      variant={variant}
      data-testid={testid}
    />
  );
};

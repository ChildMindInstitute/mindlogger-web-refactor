import { LOGO_URL } from './lib/constants';

import { Dimension } from '~/shared/utils';

export type Props = {
  size?: Dimension;
  className?: string;
};

const Logo = ({ size = { height: 50, width: 120 }, className = '' }: Props) => {
  const defaultClassName = 'mr-1 p-1';

  return (
    <img
      height={size?.height}
      width={size?.width}
      className={`${defaultClassName} ${className}`}
      src={LOGO_URL}
      loading="lazy"
    />
  );
};

export default Logo;

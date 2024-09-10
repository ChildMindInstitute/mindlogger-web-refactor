import { forwardRef } from 'react';

import MUIBox, { BoxProps } from '@mui/material/Box';

/**
 * Common proxy component of the Box component by MaterialUI.
 *
 * @component
 * @example
 * return (
 *   <Box>Anything</Box>
 * )
 */

const Box = forwardRef<HTMLDivElement, BoxProps>((props: BoxProps) => {
  return <MUIBox {...props} />;
});

Box.displayName = 'Box';

export default Box;

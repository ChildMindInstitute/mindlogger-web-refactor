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

const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  return <MUIBox {...props} ref={ref} />;
});

Box.displayName = 'Box';

export default Box;

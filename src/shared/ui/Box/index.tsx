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

function Box(props: BoxProps) {
  return <MUIBox {...props} />;
}

export default Box;

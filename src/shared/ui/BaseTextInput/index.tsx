import TextField, { TextFieldProps } from '@mui/material/TextField';

/**
 * Common proxy component of the TextField component by MaterialUI.
 *
 * @component
 * @example
 * return (
 *   <TextField
 *     fullWidth
 *     size="small"
 *     value={value}
 *     onChange={(e) => onValueChange(e.target.value)}
 *     disabled={false}
 *   />
 * )
 */

function BaseTextInput(props: TextFieldProps) {
  return <TextField {...props} />;
}

export default BaseTextInput;

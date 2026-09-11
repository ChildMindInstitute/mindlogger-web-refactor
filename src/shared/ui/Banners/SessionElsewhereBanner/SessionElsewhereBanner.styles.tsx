import { styled } from '@mui/material';

// A link that acts on this tab rather than navigating, so it has to be a button underneath.
export const StyledReloadButton = styled('button')({
  background: 'none',
  border: 'none',
  padding: 0,
  font: 'inherit',
  color: 'inherit',
  textDecoration: 'underline',
  cursor: 'pointer',
});

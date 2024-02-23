import MUIContainer, { ContainerProps } from '@mui/material/Container';

export const Container = (props: ContainerProps) => {
  return <MUIContainer {...props}>{props.children}</MUIContainer>;
};

import { SxProps } from '@mui/material';

import Box from '~/shared/ui/Box';
import { CheckboxWithLabel } from '~/shared/ui/Checkbox';

type Props = {
  id: string;
  checked?: boolean;
  label: JSX.Element;
  onChange: () => void;

  sx?: SxProps;
};

export const ConsentCheckbox = ({ id, label, onChange, checked, sx }: Props) => {
  return (
    <Box display="flex" sx={sx}>
      <CheckboxWithLabel id={id} checked={checked} onChange={onChange}>
        {label}
      </CheckboxWithLabel>
    </Box>
  );
};

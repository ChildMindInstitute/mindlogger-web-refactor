import { PropsWithChildren } from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

export interface CheckboxWithLabelProps extends PropsWithChildren {
  id?: string;
  onChange: () => void;
  checked?: boolean;
}

export const CheckboxWithLabel = ({ onChange, children, id, checked }: CheckboxWithLabelProps) => {
  return (
    <FormGroup id={id}>
      <FormControlLabel
        control={<Checkbox checked={checked} onChange={onChange} />}
        label={children}
      />
    </FormGroup>
  );
};

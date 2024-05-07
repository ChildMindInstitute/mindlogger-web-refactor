import { PropsWithChildren } from 'react';

import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

export interface CheckboxWithLabelProps extends PropsWithChildren {
  id?: string;
  onChange: () => void;
  defaultChecked?: boolean;
  value?: boolean;
}

export const CheckboxWithLabel = ({
  onChange,
  children,
  id,
  defaultChecked,
  value,
}: CheckboxWithLabelProps) => {
  return (
    <FormGroup id={id}>
      <FormControlLabel
        control={<Checkbox value={value} defaultChecked={defaultChecked} onChange={onChange} />}
        label={children}
      />
    </FormGroup>
  );
};

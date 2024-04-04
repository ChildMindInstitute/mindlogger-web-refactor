import React, { HTMLInputTypeAttribute } from 'react';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useController, useFormContext } from 'react-hook-form';

import { Theme } from '../../constants';
import { useCustomTranslation } from '../../utils';

interface IInputCommonProps {
  id: string;
  type: HTMLInputTypeAttribute;
  autoComplete?: string;

  name: string;
  placeholder?: string;
  onChange?: (e: string | number) => void;
  className?: string;

  Icon?: JSX.Element;
}

const Input = (props: IInputCommonProps) => {
  const { type, name, placeholder, onChange, className, Icon, id } = props;
  const { t } = useCustomTranslation();

  const { control } = useFormContext();
  const {
    field: { onChange: onFormChange, value },
    fieldState: { error },
  } = useController({ name, control });

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (onChange) {
      onChange(value);
    }

    onFormChange(value);
  };

  return (
    <FormControl error={!!error} sx={{ width: '100%', fontFamily: 'Atkinson' }} variant="outlined">
      <InputLabel htmlFor={id} sx={{ fontFamily: 'Atkinson' }}>
        {placeholder}
      </InputLabel>
      <OutlinedInput
        id={id}
        label={placeholder}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onInputChange}
        className={className}
        error={!!error}
        endAdornment={<InputAdornment position="end">{Icon}</InputAdornment>}
        sx={{ backgroundColor: Theme.colors.light.onPrimary, fontFamily: 'Atkinson' }}
      />
      {error?.message && (
        <FormHelperText id={id} sx={{ fontFamily: 'Atkinson' }}>
          {t(error.message)}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default Input;

import React, { HTMLInputTypeAttribute } from 'react';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useController, useFormContext } from 'react-hook-form';

import { useCustomTranslation } from '../../utils';

import { variables } from '~/shared/constants/theme/variables';

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
    field,
    fieldState: { error },
  } = useController({ name, control });

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    if (onChange) {
      onChange(value);
    }

    field.onChange(value);
  };

  return (
    <FormControl error={!!error} sx={{ width: '100%' }} variant="outlined">
      <InputLabel htmlFor={id}>{placeholder}</InputLabel>
      <OutlinedInput
        id={id}
        label={placeholder}
        type={type}
        name={name}
        placeholder={placeholder}
        value={field.value as string}
        onChange={onInputChange}
        className={className}
        error={!!error}
        endAdornment={<InputAdornment position="end">{Icon}</InputAdornment>}
        sx={{ backgroundColor: variables.palette.onPrimary }}
      />
      {error?.message && <FormHelperText id={id}>{t(error.message)}</FormHelperText>}
    </FormControl>
  );
};

export default Input;

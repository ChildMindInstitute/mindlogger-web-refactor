import { useCallback } from 'react';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';

type Props = {
  label?: string;
  value: Date | null;

  onChange: (value: Date) => void;
};

export const DateItemBase = ({ label, value, onChange }: Props) => {
  const handleChange = useCallback(
    (value: Date | null) => {
      const isValidDate = value !== null && !isNaN(value.getTime());

      if (isValidDate) {
        onChange(value);
      }
    },
    [onChange],
  );

  return <DatePicker<Date> label={label} value={value ?? null} onChange={handleChange} />;
};

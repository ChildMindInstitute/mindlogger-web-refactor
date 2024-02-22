import { useCallback } from 'react';

import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

type Props = {
  label?: string;
  value?: string;
  onChange: (value: Date) => void;
};

export const TimeItemBase = ({ label, value, onChange }: Props) => {
  const formatedValue = value ? new Date(value) : null;

  const handleChange = useCallback(
    (value: Date | null) => {
      const isValidDate = value !== null && !isNaN(value.getTime());

      if (isValidDate) {
        onChange(value);
      }
    },
    [onChange],
  );

  return (
    <DesktopTimePicker<Date>
      label={label}
      value={formatedValue}
      onChange={handleChange}
      slotProps={{ textField: { placeholder: 'HH:MM AM/PM' } }}
    />
  );
};

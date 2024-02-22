import Box from '@mui/material/Box';

import { TimeItemBase } from '~/shared/ui';

type Props = {
  value?: string;
  label?: string;

  onValueChange: (value: string[]) => void;
};

export const TimeItem = ({ value, label, onValueChange }: Props) => {
  const onHandleChange = (value: Date | null) => {
    if (value === null) {
      return;
    }

    return onValueChange([new Date(value).toString()]);
  };

  return (
    <Box display="flex" justifyContent="center" data-testid="time-item">
      <Box>
        <TimeItemBase value={value} label={label} onChange={onHandleChange} />
      </Box>
    </Box>
  );
};

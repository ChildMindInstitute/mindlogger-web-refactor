import TextField from '@mui/material/TextField';

type TextItemProps = {
  value: string | undefined;
  onValueChange: (value: string) => void;
  disabled: boolean;
};

export const TextItem = ({ value = '', onValueChange, disabled }: TextItemProps) => {
  return (
    <TextField
      fullWidth
      size="small"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      disabled={disabled}
    />
  );
};

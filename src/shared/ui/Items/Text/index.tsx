import { BaseTextInput } from '~/shared/ui';

type Props = {
  value: string | undefined;
  onValueChange: (value: string) => void;
  disabled: boolean;
  multiline?: boolean;
};

export const TextItem = ({ value = '', onValueChange, disabled, multiline }: Props) => {
  return (
    <BaseTextInput
      fullWidth
      size="small"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      disabled={disabled}
      multiline={multiline}
      minRows={multiline ? 5 : 1}
      maxRows={multiline ? 10 : 1}
    />
  );
};

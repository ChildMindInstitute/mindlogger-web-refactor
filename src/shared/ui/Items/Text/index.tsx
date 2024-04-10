import { BaseTextInput } from '~/shared/ui';

type Props = {
  value: string | undefined;
  onValueChange: (value: string) => void;
  disabled: boolean;
};

export const TextItem = ({ value = '', onValueChange, disabled }: Props) => {
  return (
    <BaseTextInput
      fullWidth
      size="small"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      disabled={disabled}
    />
  );
};

import { BaseTextInput } from '~/shared/ui';

type Props = {
  value: string | undefined;
  onValueChange: (value: string) => void;
  disabled: boolean;
  isLarge?: boolean;
};

export const TextItem = ({ value = '', onValueChange, disabled, isLarge }: Props) => {
  return (
    <BaseTextInput
      fullWidth
      size="small"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      disabled={disabled}
      multiline={isLarge}
      minRows={isLarge ? 5 : 1}
      maxRows={isLarge ? 10 : 1}
    />
  );
};

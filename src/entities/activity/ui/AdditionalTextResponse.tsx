import { BaseTextInput } from '~/shared/ui';

type Props = {
  value: string;
  onValueChange: (value: string) => void;
};

export const AdditionalTextResponse = ({ value, onValueChange }: Props) => {
  return (
    <BaseTextInput
      fullWidth
      size="small"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      disabled={false}
    />
  );
};

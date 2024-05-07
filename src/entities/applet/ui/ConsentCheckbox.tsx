import Box from '~/shared/ui/Box';
import { CheckboxWithLabel } from '~/shared/ui/Checkbox';

type Props = {
  id: string;
  value?: boolean;
  label: JSX.Element;
  onChange: () => void;
};

export const ConsentCheckbox = ({ id, label, onChange, value }: Props) => {
  return (
    <Box display="flex">
      <CheckboxWithLabel id={id} onChange={onChange} value={value}>
        {label}
      </CheckboxWithLabel>
    </Box>
  );
};

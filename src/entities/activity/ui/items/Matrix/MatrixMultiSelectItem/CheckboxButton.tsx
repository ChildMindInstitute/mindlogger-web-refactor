import Box from '@mui/material/Box';

import { MatrixCell } from '../MatrixCell';

import { CheckboxItem, SelectBaseBox } from '~/shared/ui';
import { useCustomMediaQuery } from '~/shared/utils';

type Props = {
  id: string;
  isChecked: boolean;
  text: string;

  onChange: () => void;
};

export const CheckboxButton = ({ id, isChecked, text, onChange }: Props) => {
  const { lessThanSM } = useCustomMediaQuery();

  return (
    <Box display="flex" flex={1} key={id} data-testid="matrix-checkbox-button-container">
      <MatrixCell>
        <SelectBaseBox
          color={null}
          onHandleChange={onChange}
          checked={isChecked}
          justifyContent="center"
          padding={lessThanSM ? '12px 8px' : '16px'}
        >
          <CheckboxItem
            id={id}
            name={text}
            value={text}
            disabled={false}
            defaultChecked={isChecked}
          />
        </SelectBaseBox>
      </MatrixCell>
    </Box>
  );
};

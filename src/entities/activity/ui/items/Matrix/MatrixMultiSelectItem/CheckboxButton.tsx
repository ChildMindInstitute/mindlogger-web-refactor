import Box from '@mui/material/Box';

import { MatrixCell } from '../MatrixCell';

import { CheckboxItem, SelectBaseBox } from '~/shared/ui';

type Props = {
  id: string;
  isChecked: boolean;
  text: string;

  onChange: () => void;
};

export const CheckboxButton = ({ id, isChecked, text, onChange }: Props) => {
  return (
    <Box flex={1} key={id}>
      <MatrixCell>
        <SelectBaseBox
          color={null}
          onHandleChange={onChange}
          checked={isChecked}
          justifyContent="center"
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

import Box from '@mui/material/Box';

import { MatrixCell } from '../MatrixCell';

import { RadioOption, SelectBaseBox } from '~/shared/ui';

type Props = {
  id: string;
  isChecked: boolean;
  text: string;

  onChange: () => void;
};

export const RadioButton = ({ id, text, isChecked, onChange }: Props) => {
  return (
    <Box flex={1} key={id}>
      <MatrixCell>
        <SelectBaseBox
          color={null}
          onHandleChange={onChange}
          checked={isChecked}
          justifyContent="center"
        >
          <RadioOption
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

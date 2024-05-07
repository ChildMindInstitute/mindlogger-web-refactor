import { MatrixCell } from '../MatrixCell';

import { Box } from '~/shared/ui';
import { RadioOption, SelectBaseBox } from '~/shared/ui';

type Props = {
  id: string;
  isChecked: boolean;
  text: string;

  onChange: () => void;
};

export const RadioButton = ({ id, text, isChecked, onChange }: Props) => {
  return (
    <Box flex={1} key={id} data-testid="matrix-radio-button-container">
      <MatrixCell>
        <SelectBaseBox
          color={null}
          onHandleChange={onChange}
          checked={isChecked}
          justifyContent="center"
          flex={1}
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

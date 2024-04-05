import Box from '@mui/material/Box';

import { RadioButton } from './RadioButton';
import { MatrixSelectOption, MatrixSelectRow, SingleMultiSelectAnswer } from '../../../../lib';
import { MatrixHeader } from '../MatrixHeader';
import { MatrixRow } from '../MatrixRow';

type Props = {
  options: Array<MatrixSelectOption>;
  rows: Array<MatrixSelectRow>;

  onChange: (rowIndex: number, id: string) => void;
  values: SingleMultiSelectAnswer;
};

export const RadioGrid = ({ rows, options, onChange, values }: Props) => {
  return (
    <Box display="flex" flex={1} flexDirection="column" data-testid="matrix-radio-grid">
      <MatrixHeader options={options} />

      {rows.map((row, rowI) => {
        const isEven = rowI % 2 === 0;

        return (
          <MatrixRow
            key={row.id}
            isEven={isEven}
            item={{ id: row.id, imageUrl: row.rowImage, text: row.rowName, tooltip: row.tooltip }}
          >
            {options.map((option) => {
              const isChecked = option.id === values[rowI];

              return (
                <RadioButton
                  key={option.id}
                  id={option.id}
                  text={option.text}
                  isChecked={isChecked}
                  onChange={() => onChange(rowI, option.id)}
                />
              );
            })}
          </MatrixRow>
        );
      })}
    </Box>
  );
};

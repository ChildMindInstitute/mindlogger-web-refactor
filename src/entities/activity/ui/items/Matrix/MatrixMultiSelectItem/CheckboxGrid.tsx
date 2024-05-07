import { CheckboxButton } from './CheckboxButton';
import { MatrixMultiSelectAnswer, MatrixSelectOption, MatrixSelectRow } from '../../../../lib';
import { MatrixHeader } from '../MatrixHeader';
import { MatrixRow } from '../MatrixRow';

import { Box } from '~/shared/ui';

type Props = {
  options: Array<MatrixSelectOption>;
  rows: Array<MatrixSelectRow>;

  onChange: (rowIndex: number, optionIndex: number, value: string) => void;
  values: MatrixMultiSelectAnswer;
};

export const CheckboxGrid = ({ rows, options, onChange, values }: Props) => {
  return (
    <Box display="flex" flex={1} flexDirection="column" data-testid="matrix-checkbox-grid">
      <MatrixHeader options={options} />

      {rows.map((row, rowI) => {
        const isEven = rowI % 2 === 0;

        return (
          <MatrixRow
            key={row.id}
            isEven={isEven}
            item={{ id: row.id, imageUrl: row.rowImage, text: row.rowName, tooltip: row.tooltip }}
          >
            {options.map((option, optionI) => {
              const isChecked = Boolean(values[rowI]?.[optionI]);

              return (
                <CheckboxButton
                  key={option.id}
                  id={option.id}
                  text={option.text}
                  isChecked={isChecked}
                  onChange={() => onChange(rowI, optionI, option.text)}
                />
              );
            })}
          </MatrixRow>
        );
      })}
    </Box>
  );
};

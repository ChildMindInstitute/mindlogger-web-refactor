import Box from '@mui/material/Box';

import { MatrixCell } from './MatrixCell';
import { MatrixHeader } from './MatrixHeader';
import { MatrixRow } from './MatrixRow';
import { MatrixMultiSelectAnswer, MatrixSelectOption, MatrixSelectRow } from '../../../lib';

import { CheckboxItem, SelectBaseBox } from '~/shared/ui';

type Props = {
  options: Array<MatrixSelectOption>;
  rows: Array<MatrixSelectRow>;

  onChange: (rowIndex: number, optionIndex: number, value: string) => void;
  values: MatrixMultiSelectAnswer;
};

export const StackedItemsGrid = ({ rows, options, onChange, values }: Props) => {
  return (
    <Box display="flex" flex={1} flexDirection="column">
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
                <Box flex={1} key={option.id}>
                  <MatrixCell>
                    <SelectBaseBox
                      color={null}
                      onHandleChange={() => onChange(rowI, optionI, option.text)}
                      checked={isChecked}
                      justifyContent="center"
                    >
                      <CheckboxItem
                        id={option.id}
                        name={option.text}
                        value={option.text}
                        disabled={false}
                        defaultChecked={isChecked}
                      />
                    </SelectBaseBox>
                  </MatrixCell>
                </Box>
              );
            })}
          </MatrixRow>
        );
      })}
    </Box>
  );
};

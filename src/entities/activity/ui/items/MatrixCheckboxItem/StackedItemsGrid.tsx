import Box from '@mui/material/Box';

import { MatrixCell } from './MatrixCell';
import { MatrixHeader } from './MatrixHeader';
import { MatrixRow } from './MatrixRow';
import { MatrixSelectOption, MatrixSelectRow } from '../../../lib';

import { CheckboxItem, SelectBaseBox } from '~/shared/ui';

type Props = {
  options: Array<MatrixSelectOption>;
  rows: Array<MatrixSelectRow>;
};

export const StackedItemsGrid = ({ rows, options }: Props) => {
  return (
    <Box display="flex" flex={1} flexDirection="column">
      <MatrixHeader options={options} />

      {rows.map((row) => {
        return (
          <MatrixRow
            key={row.id}
            isEven={false}
            item={{ id: row.id, imageUrl: row.rowImage, text: row.rowName, tooltip: row.tooltip }}
          >
            {options.map((option) => (
              <Box flex={1} key={option.id}>
                <MatrixCell>
                  <SelectBaseBox
                    color={null}
                    onHandleChange={() => console.log('Click')} // ToDo: Implement
                    checked={false}
                    justifyContent="center"
                  >
                    <CheckboxItem
                      id={'id1'}
                      name={'id1-name'}
                      value={'daw'}
                      disabled={false}
                      defaultChecked={false}
                    />
                  </SelectBaseBox>
                </MatrixCell>
              </Box>
            ))}
          </MatrixRow>
        );
      })}
    </Box>
  );
};

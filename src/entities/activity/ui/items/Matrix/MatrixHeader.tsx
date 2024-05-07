import { AxisListItem } from './AxisListItem';
import { MatrixRow } from './MatrixRow';
import { MatrixSelectOption } from '../../../lib';

type Props = {
  options: Array<MatrixSelectOption>;
};

export const MatrixHeader = ({ options }: Props) => {
  return (
    <MatrixRow isEven={false} item={null}>
      {options.map((option) => {
        return (
          <AxisListItem
            key={option.id}
            maxWidth={1}
            axisHeaderFor="column"
            item={{
              id: option.id,
              imageUrl: option.image,
              text: option.text,
              tooltip: option.tooltip,
            }}
          />
        );
      })}
    </MatrixRow>
  );
};

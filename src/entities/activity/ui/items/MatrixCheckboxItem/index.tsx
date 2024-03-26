import { MultiSelectionRowsItem } from '../../../lib';

type Props = {
  item: MultiSelectionRowsItem;
  values: string[];

  onValueChange: (value: string[]) => void;
  replaceText: (value: string) => string;
  isDisabled: boolean;
};

export const MatrixCheckboxItem = (props: Props) => {
  return <div>It is MatrixCheckboxItem</div>;
};

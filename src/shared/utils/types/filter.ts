export interface IFilter<ItemProp, Result> {
  filter: (items: ItemProp[]) => Result;
}

export interface IFilter<TItem, TResult = TItem[]> {
  filter: (items: TItem[]) => TResult;
}

import { AnswerTypesPayload } from '~/shared/api';

export interface ItemAnswer<T extends AnswerTypesPayload> {
  answer: T | null;
  itemId: string;
}

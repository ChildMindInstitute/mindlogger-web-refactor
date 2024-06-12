import { MultiInformantState } from '~/abstract/lib/types/multiInformant';

export type TakeNowParams = {
  appletId: string;
  startActivityOrFlow: string;
  targetSubjectId: string;
  sourceSubjectId: string;
  respondentId: string;
};

export type TakeNowValidationErrorType =
  | 'mismatchedRespondent'
  | 'invalidRespondent'
  | 'invalidApplet'
  | 'invalidActivity'
  | 'invalidSubject'
  | 'common_loading_error';

export type TakeNowValidationError = {
  type: TakeNowValidationErrorType;
  error: string;
};

export type TakeNowValidatedState = {
  isLoading: boolean;
  isError: boolean;
  isSuccess: boolean;
  error?: TakeNowValidationError | null;
  data?: Required<MultiInformantState>;
};

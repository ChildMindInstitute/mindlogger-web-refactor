import { MultiInformantState } from '~/abstract/lib/types/multiInformant';

export type TakeNowParams = {
  appletId: string;
  startActivityOrFlow: string;
  targetSubjectId: string;
  sourceSubjectId: string;
  respondentId: string;
  multiInformantAssessmentId: string | null;
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

export type TakeNowSuccessModalProps = MultiInformantState & {
  isOpen: boolean;
  onClose?: () => void;
};

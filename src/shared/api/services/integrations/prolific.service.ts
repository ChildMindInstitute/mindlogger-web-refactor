import { axiosService } from '~/shared/api';

type ProlificStudyValidationResponse = {
  accepted: boolean;
};

type CompletionCodeAction = {
  action: string;
};

type ProlificCompletionCode = {
  code: string;
  codeType: string;
  actions: CompletionCodeAction[];
  actor: string;
};

type ProlificCompletionCodeList = {
  completionCodes: ProlificCompletionCode[];
};

type ProlificPublicUser = {
  exists: boolean;
};

const getProlificService = () => {
  return {
    isProlificStudyValidated: (appletId?: string, prolificStudyId?: string) =>
      axiosService.get<ProlificStudyValidationResponse>(
        `/integrations/prolific/applet/${appletId}/study_id/${prolificStudyId}`,
      ),
    getStudyCompletionCodes: (appletId: string, studyId: string) =>
      axiosService.get<ProlificCompletionCodeList>(
        `/integrations/prolific/applet/${appletId}/completion_codes/${studyId}`,
      ),
    prolificUserExists: (prolificPid: string, studyId: string) =>
      axiosService.get<ProlificPublicUser>(
        `/integrations/prolific/applet/pid/${prolificPid}/study_id/${studyId}`,
      ),
  };
};

export default getProlificService();

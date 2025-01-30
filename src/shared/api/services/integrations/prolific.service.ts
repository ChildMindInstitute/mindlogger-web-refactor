import { axiosService } from '~/shared/api';

type ProlificIntegrationResponse = {
  enabled: boolean;
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

const getProlificService = () => {
  return {
    isProlificIntergrationEnabled: (appletId?: string, prolificStudyId?: string) =>
      axiosService.get<ProlificIntegrationResponse>(
        `/integrations/prolific/applet/${appletId}/study_id/${prolificStudyId}`,
      ),
    getStudyCompletionCodes: (appletId: string, studyId: string) =>
      axiosService.get<ProlificCompletionCodeList>(
        `/integrations/prolific/applet/${appletId}/completion_codes/${studyId}`,
      ),
  };
};

export default getProlificService();

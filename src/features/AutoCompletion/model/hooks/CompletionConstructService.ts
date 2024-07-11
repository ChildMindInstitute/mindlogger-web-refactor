import { AxiosError, AxiosResponse } from 'axios';

import { ActivitySuccessfullySubmitted } from './useAutoCompletionStateManager';
import { AutoCompletion } from '../slice';

import { appletModel } from '~/entities/applet';
import { mapItemToRecord } from '~/entities/applet/model/mapper';
import { BuildAnswerParams, SurveyContext } from '~/features/PassSurvey';
import {
  ActivityDTO,
  ActivityItemDetailsDTO,
  AnswerPayload,
  BaseError,
  SuccessResponseActivityById,
} from '~/shared/api';

type SubmitOutput =
  | {
      isSuccessful: true;
      rawResponse: SubmitResponse;
    }
  | {
      isSuccessful: false;
      error: unknown;
    };

type SubmitResponse = AxiosResponse<any, BaseError>;

type Item = appletModel.ItemRecord;

type CompleteActivityParams = {
  activityId: string;
  items: Item[];
  userEvents: appletModel.UserEvent[];
  isLastActivity: boolean;
};

type Input = {
  completionRecord: AutoCompletion;
  interruptedProgress: appletModel.ActivityProgress;

  surveyContext: SurveyContext;

  buildAnswer: (payload: BuildAnswerParams) => AnswerPayload;
  submitAnswers: (payload: AnswerPayload) => Promise<SubmitResponse>;

  activitySuccessfullySubmitted: (payload: ActivitySuccessfullySubmitted) => void;

  fetchActivityById: (
    activityId: string,
  ) => Promise<AxiosResponse<SuccessResponseActivityById, BaseError>>;
};

export class CompletionContructService {
  private logger: Console = console;

  private interruptedActivityId: string;

  private surveyContext: SurveyContext;

  private completionRecord: AutoCompletion;

  private interruptedProgress: appletModel.ActivityProgress;

  private buildAnswer: (payload: BuildAnswerParams) => AnswerPayload;

  private submitAnswers: (payload: AnswerPayload) => Promise<AxiosResponse<any, BaseError>>;

  private activitySuccessfullySubmitted: (payload: ActivitySuccessfullySubmitted) => void;

  private fetchActivityById: (
    activityId: string,
  ) => Promise<AxiosResponse<SuccessResponseActivityById, BaseError>>;

  constructor(input: Input) {
    this.interruptedActivityId = input.surveyContext.activityId;
    this.surveyContext = input.surveyContext;
    this.completionRecord = input.completionRecord;
    this.interruptedProgress = input.interruptedProgress;
    this.buildAnswer = input.buildAnswer;
    this.submitAnswers = input.submitAnswers;
    this.fetchActivityById = input.fetchActivityById;
    this.activitySuccessfullySubmitted = input.activitySuccessfullySubmitted;
  }

  public async complete() {
    for (const activityId of this.completionRecord.activityIdsToSubmit) {
      if (activityId === this.interruptedActivityId) {
        await this.completeInterruptedActivity(activityId);
      } else {
        await this.completeEmptyActivity(activityId);
      }
    }
  }

  private async completeInterruptedActivity(activityId: string): Promise<boolean> {
    const isCompleted = await this.completeActivity({
      activityId,
      items: this.interruptedProgress.items,
      userEvents: this.interruptedProgress.userEvents,
      isLastActivity: this.isLastActivity(activityId),
    });

    return isCompleted;
  }

  private async completeEmptyActivity(activityId: string) {
    const activityDTO = await this.getActivityById(activityId);

    const items = this.fillItemsWithEmptyAnswers(activityDTO.items);

    const isCompleted = await this.completeActivity({
      activityId,
      items,
      userEvents: [],
      isLastActivity: this.isLastActivity(activityId),
    });

    return isCompleted;
  }

  private async completeActivity(params: CompleteActivityParams): Promise<boolean> {
    const answerPayload: AnswerPayload = this.buildAnswer({
      entityId: this.surveyContext.entityId,
      event: this.surveyContext.event,
      appletId: this.surveyContext.appletId,
      appletVersion: this.surveyContext.appletVersion,
      encryption: this.surveyContext.encryption,
      flow: this.surveyContext.flow,
      publicAppletKey: this.surveyContext.publicAppletKey,
      activityId: params.activityId,
      items: params.items,
      userEvents: params.userEvents,
      isFlowCompleted: params.isLastActivity,
    });

    const submitOutput: SubmitOutput = await this.submit(answerPayload);

    if (submitOutput.isSuccessful) {
      // Here we can handle the successful submission
      this.activitySuccessfullySubmitted({
        entityId: this.surveyContext.entityId,
        eventId: this.surveyContext.eventId,
        activityId: params.activityId,
      });
    }

    if (!submitOutput.isSuccessful) {
      // Here we can handle the error and re-send the correct answer if needed
    }

    return submitOutput.isSuccessful;
  }

  private async getActivityById(activityId: string): Promise<ActivityDTO> {
    let activityDTO: ActivityDTO | undefined;

    try {
      const response = await this.fetchActivityById(activityId);

      activityDTO = response.data.result;
    } catch (error) {
      this.logger.error(error);
      throw new Error(
        `[CompletionContructService:getActivityById] Error while fetching activity by ID: ${activityId}`,
      );
    }

    return activityDTO;
  }

  private isLastActivity(activityId: string): boolean {
    return (
      this.completionRecord.activityIdsToSubmit[
        this.completionRecord.activityIdsToSubmit.length - 1
      ] === activityId
    );
  }

  private fillItemsWithEmptyAnswers(items: ActivityItemDetailsDTO[]): Item[] {
    return items.map(mapItemToRecord);
  }

  private async submit(payload: AnswerPayload): Promise<SubmitOutput> {
    let response: SubmitResponse | undefined;
    let errorResponse: unknown;

    try {
      response = await this.submitAnswers(payload);
    } catch (error: unknown) {
      // We should not throw an error here and stop the process
      // because we have a chance to get the validation error "Incorrect answer order".

      // Need to discuss with the backend team the implementation of the specific error to determine the required answer.
      // Now error message - "Incorrect activity order" is not informative enough.
      // Good error message - { type: "INCORRECT_ANSWER_ORDER", expected: {activityId} }. Then we can handle it and send the correct answer.
      this.logger.error(error);
      errorResponse = error;

      if (error instanceof AxiosError) {
        this.logger.error(
          `[ProcessingScreen:submitAnswersForActivity] Error: ${error.response?.data.result[0].message}`,
        );
      }
    }

    if (response && response.status === 201) {
      return {
        isSuccessful: true,
        rawResponse: response,
      };
    }

    return {
      isSuccessful: false,
      error: errorResponse,
    };
  }
}

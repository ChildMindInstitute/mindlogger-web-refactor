import { fetchActivityById } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { mapItemToRecord } from '~/entities/applet/model/mapper';
import { AnswerBuilder } from '~/features/PassSurvey';
import { ActivityDTO, AnswerPayload } from '~/shared/api';

interface IEntityCompletionService {
  complete: (activityId: string) => Promise<AnswerPayload>;
}

export type BuildAnswerParams = {
  activityId: string;
  items: appletModel.ItemRecord[];
  userEvents: appletModel.UserEvent[];
  isLastActivity: boolean;
};

type Input = {
  interruptedActivityId: string;
  isPublic: boolean;
  activityIdsToSubmit: string[];
  activityProgress: appletModel.ActivityProgress | null;

  answerBuilder: AnswerBuilder;
};

type Handlers = {
  onActivityFetched: (activity: ActivityDTO) => void;
};

export class EntityCompletionService implements IEntityCompletionService {
  private isPublic: boolean;

  private interruptedActivityId: string;

  private activityIdsToSubmit: string[];

  private activityProgress: appletModel.ActivityProgress | null;

  private answerBuilder: AnswerBuilder;

  private handlers: Handlers;

  constructor(input: Input, handlers: Handlers) {
    this.answerBuilder = input.answerBuilder;
    this.interruptedActivityId = input.interruptedActivityId;
    this.isPublic = input.isPublic;
    this.activityIdsToSubmit = input.activityIdsToSubmit;
    this.activityProgress = input.activityProgress;
    this.handlers = handlers;
  }

  public async complete(activityId: string) {
    if (this.isInterruptedActivity(activityId)) {
      return this.completeInterrupted(activityId);
    } else {
      return this.completeEmpty(activityId);
    }
  }

  private async completeEmpty(activityId: string): Promise<AnswerPayload> {
    const activityDTO = await fetchActivityById({
      activityId,
      isPublic: this.isPublic,
    });

    if (this.handlers.onActivityFetched) {
      this.handlers.onActivityFetched(activityDTO);
    }

    const items = activityDTO.items.map(mapItemToRecord);

    return this.answerBuilder.build({
      activityId,
      items,
      userEvents: [],
      isFlowCompleted: this.isLastActivity(activityId),
    });
  }

  private completeInterrupted(activityId: string): AnswerPayload {
    if (!this.activityProgress) {
      throw new Error(
        `[EntityCompletionService:completeInterrupted] Activity progress is not found for activityId: ${activityId}`,
      );
    }

    const items = this.activityProgress.items;

    const userEvents = this.activityProgress.userEvents;

    return this.answerBuilder.build({
      activityId,
      items,
      userEvents,
      isFlowCompleted: this.isLastActivity(activityId),
    });
  }

  private isInterruptedActivity(activityId: string): boolean {
    return this.interruptedActivityId === activityId;
  }

  private isLastActivity(activityId: string): boolean {
    return this.activityIdsToSubmit[this.activityIdsToSubmit.length - 1] === activityId;
  }
}

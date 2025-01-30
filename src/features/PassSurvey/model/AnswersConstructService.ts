import { getUnixTime } from 'date-fns';
import { v4 as uuid } from 'uuid';

import { ItemAnswer, mapAlerts, mapToAnswers } from '../helpers';

import { ActivityPipelineType, GroupProgress } from '~/abstract/lib';
import { DefaultAnswer } from '~/entities/activity';
import { appletModel } from '~/entities/applet';
import { ProlificUrlParamsPayload } from '~/entities/applet/model';
import { userModel } from '~/entities/user';
import {
  ActivityFlowDTO,
  AnswerPayload,
  AnswerTypesPayload,
  EncryptionDTO,
  ScheduleEventDto,
} from '~/shared/api';
import { encryption, formatToDtoDate, formatToDtoTime } from '~/shared/utils';

interface ICompletionConstructService {
  construct: () => AnswerPayload;
}

type ItemRecord = appletModel.ItemRecord;

type UserEvents = appletModel.UserEvent[];

type Answers = Array<ItemAnswer<AnswerTypesPayload>>;

type AnswersDictionary = {
  answer: AnswerTypesPayload[];
  itemIds: string[];
};

type Input = {
  event: ScheduleEventDto;

  activityId: string;
  appletId: string;
  appletVersion: string;
  flow: ActivityFlowDTO | null;
  encryption: EncryptionDTO;

  groupProgress: GroupProgress;

  items: ItemRecord[];
  userEvents: UserEvents;

  publicAppletKey: string | null;

  isFlowCompleted?: boolean;

  prolificParams?: ProlificUrlParamsPayload;
};

export default class AnswersConstructService implements ICompletionConstructService {
  private appletId: string;

  private appletVersion: string;

  private activityId: string;

  private event: ScheduleEventDto;

  private groupProgress: GroupProgress;

  private publicAppletKey: string | null = null;

  private flow: ActivityFlowDTO | null;

  private encryption: EncryptionDTO;

  private items: ItemRecord[];

  private userEvents: UserEvents;

  private isFlowCompleted: boolean | undefined; // We can enforce this to be defined if needed

  private prolificParams?: ProlificUrlParamsPayload;

  constructor(input: Input) {
    this.activityId = input.activityId;
    this.event = input.event;
    this.groupProgress = input.groupProgress;
    this.publicAppletKey = input.publicAppletKey;
    this.flow = input.flow;
    this.encryption = input.encryption;
    this.appletId = input.appletId;
    this.appletVersion = input.appletVersion;
    this.items = input.items;
    this.userEvents = input.userEvents;
    this.isFlowCompleted = input.isFlowCompleted;
    this.prolificParams = input.prolificParams;
  }

  public construct(): AnswerPayload {
    const answers: Answers = mapToAnswers(this.items);

    const answersDictionary = this.buildAnswersDictionary(answers);

    const preparedAlerts = mapAlerts(this.items);

    const privateKey = this.generatePrivateKey(this.isPublic(this.publicAppletKey));

    const encryptedAnswers = this.encrypt(JSON.stringify(answersDictionary.answer), privateKey);

    const encryptedUserEvents = this.encrypt(JSON.stringify(this.userEvents), privateKey);

    const dataIdentifier = this.getDataIdentifier(this.items);

    const encryptedIdentifier = dataIdentifier ? this.encrypt(dataIdentifier, privateKey) : null;

    const isSurveyCompleted = this.isSurveyCompleted();

    const publicKey = this.generatePublicKey(privateKey);

    return {
      appletId: this.appletId,
      activityId: this.activityId,
      flowId: this.flow?.id ?? null,
      submitId: this.getSubmitId(),
      version: this.appletVersion,
      createdAt: new Date().getTime(),
      isFlowCompleted: isSurveyCompleted,
      prolificParams: this.prolificParams,
      answer: {
        answer: encryptedAnswers,
        itemIds: answersDictionary.itemIds,
        events: encryptedUserEvents,
        userPublicKey: JSON.stringify(publicKey),
        startTime: new Date(this.groupProgress.startAt ?? Date.now()).getTime(),
        endTime: new Date().getTime(),
        identifier: encryptedIdentifier,
        scheduledEventId: this.event.id,
        localEndDate: formatToDtoDate(new Date()),
        localEndTime: formatToDtoTime(new Date()),
        scheduledTime: this.getEventScheduledTime() ?? undefined,
      },
      alerts: preparedAlerts,
      client: {
        appId: 'mindlogger-web',
        appVersion: import.meta.env.VITE_BUILD_VERSION,
        width: window.innerWidth,
        height: window.innerHeight,
      },
    };
  }

  private isPublic = (publicAppletKey: string | null): boolean => !!publicAppletKey;

  private generatePrivateKey(isPublic: boolean): number[] {
    // If PublicFlow is true, generate the private key based on random UUIDs
    if (isPublic) {
      return encryption.getPrivateKey({
        userId: uuid(),
        email: uuid(),
        password: uuid(),
      });
    }

    // Otherwise, get the user private key from the secure local storage
    const userPrivateKey = userModel.secureUserPrivateKeyStorage.getUserPrivateKey();

    if (!userPrivateKey) {
      throw new Error('[AnswersConstructBuilder] User Private Key is not defined');
    }

    return userPrivateKey;
  }

  private generatePublicKey(privateKey: number[]) {
    return encryption.getPublicKey({
      privateKey,
      appletPrime: JSON.parse(this.encryption.prime) as number[],
      appletBase: JSON.parse(this.encryption.base) as number[],
    });
  }

  private encrypt(payload: string, privateKey: number[]): string {
    const aeskey = encryption.getAESKey({
      appletPrime: JSON.parse(this.encryption.prime) as number[],
      appletBase: JSON.parse(this.encryption.base) as number[],
      appletPublicKey: JSON.parse(this.encryption.publicKey) as number[],
      userPrivateKey: privateKey,
    });

    return encryption.encryptData({
      text: payload,
      key: aeskey,
    });
  }

  private buildAnswersDictionary(answers: Answers): AnswersDictionary {
    return answers.reduce(
      (acc, itemAnswer) => {
        if (itemAnswer) {
          acc.answer.push(itemAnswer.answer);
          acc.itemIds.push(itemAnswer.itemId);
        }

        return acc;
      },
      {
        answer: [],
        itemIds: [],
      } as AnswersDictionary,
    );
  }

  private getDataIdentifier(items: ItemRecord[]): string | null {
    const firstResponseDataIdentifier = items.find((item) => {
      if (item.responseType === 'text') {
        return item.config.responseDataIdentifier;
      }
      return false;
    });

    if (!firstResponseDataIdentifier) {
      return null;
    }

    return (firstResponseDataIdentifier.answer as DefaultAnswer)[0];
  }

  private isSurveyCompleted(): boolean {
    // We use this flag to enforce the completion of the flow
    if (this.isFlowCompleted !== undefined) {
      return this.isFlowCompleted;
    }

    if (this.groupProgress.type === ActivityPipelineType.Regular) {
      return true;
    }

    if (!this.flow) {
      throw new Error('[AnswersConstructBuilder] Flow is not defined');
    }

    const activitiesInFlow = this.flow.activityIds.length;

    const pipelineActivityOrder = this.groupProgress.pipelineActivityOrder;

    return activitiesInFlow === pipelineActivityOrder + 1;
  }

  private getSubmitId(): string {
    if (this.groupProgress.type === ActivityPipelineType.Regular) {
      return uuid();
    }

    return this.groupProgress.executionGroupKey;
  }

  private getEventScheduledTime(): number | null {
    const startFromDate = this.event.availability.startDate;
    const startFromHour = this.event.availability.timeFrom?.hours;
    const startFromMinute = this.event.availability.timeFrom?.minutes;
    if (!startFromDate || !startFromHour || !startFromMinute) {
      return null;
    }

    const startFrom = new Date(startFromDate).setHours(startFromHour, startFromMinute, 0, 0);

    return startFromHour && startFromMinute ? getUnixTime(startFrom) : null;
  }
}

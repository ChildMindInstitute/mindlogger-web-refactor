import { CuriousApi } from './api';

// Client for the backend schedule API (/applets/{appletId}/events).

export type PeriodicityType = 'ALWAYS' | 'ONCE' | 'DAILY' | 'WEEKLY' | 'WEEKDAYS' | 'MONTHLY';

// Exactly one of activityId / flowId must be set.
export type EventTarget = {
  activityId?: string;
  flowId?: string;
  respondentId?: string;
};

export type ScheduledEventOptions = {
  type?: Exclude<PeriodicityType, 'ALWAYS'>;
  // Times are HH:MM:SS strings; dates are YYYY-MM-DD.
  startTime?: string;
  endTime?: string;
  startDate?: string;
  endDate?: string;
  selectedDate?: string;
  accessBeforeSchedule?: boolean;
  oneTimeCompletion?: boolean;
  // timerType IDLE with timer 'HH:MM:SS' drives the idle-timeout cases.
  timerType?: 'NOT_SET' | 'TIMER' | 'IDLE';
  timer?: string;
};

const isoDate = (offsetDays = 0): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

export class EventAPI extends CuriousApi {
  async getEvents(appletId: string): Promise<any> {
    const response = await this.apiContext.get(`/applets/${appletId}/events`);
    if (!response.ok()) {
      throw new Error(`Failed to fetch events: ${response.status()} ${await response.text()}`);
    }
    return await response.json();
  }

  async createAlwaysAvailableEvent(
    appletId: string,
    target: EventTarget,
    { oneTimeCompletion = false }: { oneTimeCompletion?: boolean } = {},
  ): Promise<any> {
    return this.createEvent(appletId, {
      ...target,
      periodicity: { type: 'ALWAYS' },
      oneTimeCompletion,
      timerType: 'NOT_SET',
    });
  }

  async createScheduledEvent(
    appletId: string,
    target: EventTarget,
    options: ScheduledEventOptions = {},
  ): Promise<any> {
    const {
      type = 'DAILY',
      startTime = '00:00:00',
      endTime = '23:59:00',
      startDate = isoDate(-1),
      endDate = isoDate(365),
      selectedDate,
      accessBeforeSchedule = false,
      timerType = 'NOT_SET',
      timer,
    } = options;

    return this.createEvent(appletId, {
      ...target,
      periodicity: {
        type,
        // ONCE uses selectedDate only; recurring types use the date range.
        ...(type === 'ONCE'
          ? { selectedDate: selectedDate ?? isoDate() }
          : { startDate, endDate, ...(type === 'MONTHLY' && { selectedDate: selectedDate ?? isoDate() }) }),
      },
      startTime,
      endTime,
      accessBeforeSchedule,
      timerType,
      ...(timer && { timer }),
    });
  }

  async createEvent(appletId: string, payload: object): Promise<any> {
    const response = await this.apiContext.post(`/applets/${appletId}/events`, { data: payload });
    if (!response.ok()) {
      throw new Error(`Failed to create event: ${response.status()} ${await response.text()}`);
    }
    return await response.json();
  }

  async updateEvent(appletId: string, eventId: string, payload: object): Promise<any> {
    const response = await this.apiContext.put(`/applets/${appletId}/events/${eventId}`, {
      data: payload,
    });
    if (!response.ok()) {
      throw new Error(`Failed to update event: ${response.status()} ${await response.text()}`);
    }
    return await response.json();
  }

  async deleteEvent(appletId: string, eventId: string): Promise<void> {
    const response = await this.apiContext.delete(`/applets/${appletId}/events/${eventId}`);
    if (!response.ok()) {
      throw new Error(`Failed to delete event: ${response.status()} ${await response.text()}`);
    }
  }

  async deleteAllEvents(appletId: string): Promise<void> {
    const response = await this.apiContext.delete(`/applets/${appletId}/events`);
    if (!response.ok()) {
      throw new Error(`Failed to delete events: ${response.status()} ${await response.text()}`);
    }
  }
}

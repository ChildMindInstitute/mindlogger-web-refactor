import { extractActivityIdsToSubmitByParams } from './extractActivityidsToSubmitByParams';

import { appletModel } from '~/entities/applet';

describe('extractActivityIdsToSubmitByParams', () => {
  const mockActivityProgress: appletModel.ActivityProgress = {
    items: [],
    step: 0,
    userEvents: [],
    isSummaryScreenOpen: false,
    scoreSettings: undefined,
    itemTimer: {},
  };

  it('should return an array with the current activity id if isFlow is false', () => {
    const params = {
      isFlow: false,
      interruptedActivityId: 'activity1',
      flowActivityIds: null,
      interruptedActivityProgress: mockActivityProgress,
    };

    const result = extractActivityIdsToSubmitByParams(params);

    expect(result).toEqual(['activity1']);
  });

  it('should throw an error if flowActivityIds is not defined', () => {
    const params = {
      isFlow: true,
      interruptedActivityId: 'activity1',
      flowActivityIds: null,
      interruptedActivityProgress: mockActivityProgress,
    };

    expect(() => extractActivityIdsToSubmitByParams(params)).toThrowError(
      '[CompletionContructService:extractActivityIdsToSubmitByParams] Flow activity ids are not defined',
    );
  });

  it('should return an array with the current activity id and the last activity id if isInterruptedActivityLast is false', () => {
    const params = {
      isFlow: true,
      interruptedActivityId: 'activity1',
      flowActivityIds: ['activity1', 'activity2', 'activity3'],
      interruptedActivityProgress: mockActivityProgress,
    };

    const result = extractActivityIdsToSubmitByParams(params);

    expect(result).toEqual(['activity1', 'activity3']);
  });

  it('should return an array with only the current activity id if isInterruptedActivityLast is true', () => {
    const params = {
      isFlow: true,
      interruptedActivityId: 'activity3',
      flowActivityIds: ['activity1', 'activity2', 'activity3'],
      interruptedActivityProgress: mockActivityProgress,
    };

    const result = extractActivityIdsToSubmitByParams(params);

    expect(result).toEqual(['activity3']);
  });

  it('should return an array with the current activity id and the last activity id if isInterruptedActivityLast is false', () => {
    const params = {
      isFlow: true,
      interruptedActivityId: 'activity2',
      flowActivityIds: ['activity1', 'activity2', 'activity3'],
      interruptedActivityProgress: mockActivityProgress,
    };

    const result = extractActivityIdsToSubmitByParams(params);

    expect(result).toEqual(['activity2', 'activity3']);
  });

  it('should return an array with the last activity id if is interrupted activity id has not progress state', () => {
    const params = {
      isFlow: true,
      interruptedActivityId: 'activity2',
      flowActivityIds: ['activity1', 'activity2', 'activity3'],
      interruptedActivityProgress: null,
    };

    const result = extractActivityIdsToSubmitByParams(params);

    expect(result).toEqual(['activity3']);
  });

  it('should return an array with the current activity id and the last activity id if isInterruptedActivityLast is false', () => {
    const params = {
      isFlow: true,
      interruptedActivityId: 'activity2',
      flowActivityIds: ['activity1', 'activity2', 'activity3'],
      interruptedActivityProgress: mockActivityProgress,
    };

    const result = extractActivityIdsToSubmitByParams(params);

    expect(result).toEqual(['activity2', 'activity3']);
  });

  it('should return an array with the last activity id if the interrupted activity progress is empty', () => {
    const params = {
      isFlow: true,
      interruptedActivityId: 'activity2',
      flowActivityIds: ['activity1', 'activity2', 'activity3'],
      interruptedActivityProgress: null,
    };

    const result = extractActivityIdsToSubmitByParams(params);

    expect(result).toEqual(['activity3']);
  });
});

import { extractActivityIdsToSubmitByParams } from './extractActivityidsToSubmitByParams';

describe('extractActivityIdsToSubmitByParams', () => {
  it('should return an array with the current activity id if isFlow is false', () => {
    const params = {
      isFlow: false,
      currentActivityId: 'activity1',
      flowActivityIds: null,
    };

    const result = extractActivityIdsToSubmitByParams(params);

    expect(result).toEqual(['activity1']);
  });

  it('should throw an error if flowActivityIds is not defined', () => {
    const params = {
      isFlow: true,
      currentActivityId: 'activity1',
      flowActivityIds: null,
    };

    expect(() => extractActivityIdsToSubmitByParams(params)).toThrowError(
      '[CompletionContructService:extractActivityIdsToSubmitByParams] Flow activity ids are not defined',
    );
  });

  it('should return an array with the current activity id and the last activity id if isInterruptedActivityLast is false', () => {
    const params = {
      isFlow: true,
      currentActivityId: 'activity1',
      flowActivityIds: ['activity1', 'activity2', 'activity3'],
    };

    const result = extractActivityIdsToSubmitByParams(params);

    expect(result).toEqual(['activity1', 'activity3']);
  });

  it('should return an array with only the current activity id if isInterruptedActivityLast is true', () => {
    const params = {
      isFlow: true,
      currentActivityId: 'activity3',
      flowActivityIds: ['activity1', 'activity2', 'activity3'],
    };

    const result = extractActivityIdsToSubmitByParams(params);

    expect(result).toEqual(['activity3']);
  });
});

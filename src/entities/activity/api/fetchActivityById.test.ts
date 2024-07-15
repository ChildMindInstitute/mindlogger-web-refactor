import { fetchActivityById } from './fetchActivityById';

import { ActivityApiProxyService } from '~/shared/api/';

jest.mock('~/shared/api');

describe('fetchActivityById', () => {
  const activityId = 'testActivityId';
  const isPublic = true;

  it('should throw an error if there is an error while fetching activity by ID', async () => {
    jest.fn(ActivityApiProxyService.getActivityById).mockImplementation(() => {
      throw new Error('Test error');
    });

    await expect(fetchActivityById({ activityId, isPublic })).rejects.toThrow(
      `[fetchActivityById.ts] Error while fetching activity by ID: ${activityId}`,
    );
  });
});

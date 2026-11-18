import { onlineManager } from '@tanstack/react-query';
import { fireEvent, screen } from '@testing-library/react';

import { ActivityCardRestartResume } from './ActivityCardRestartResume';

import { ActivityStatus } from '~/abstract/lib/GroupBuilder';
import { renderWithProviders } from '~/test/utils';

const onStartClick = vi.fn();
const onResumeClick = vi.fn();

const renderButtons = (activityStatus: ActivityStatus) =>
  renderWithProviders(
    <ActivityCardRestartResume
      activityStatus={activityStatus}
      activityName="Activity"
      onRestartClick={vi.fn()}
      onResumeClick={onResumeClick}
      onStartClick={onStartClick}
      isDisabled={false}
      isAutoCompletionRecordDefined={false}
    />,
    {},
  );

describe('ActivityCardRestartResume', () => {
  afterEach(() => {
    onlineManager.setOnline(undefined);
    vi.clearAllMocks();
  });

  it('shows the no internet popup instead of resuming when offline', () => {
    onlineManager.setOnline(false);
    renderButtons(ActivityStatus.InProgress);

    fireEvent.click(screen.getByRole('button', { name: 'additional.resume' }));

    expect(screen.getByTestId('no-internet-modal')).toBeInTheDocument();
    expect(onResumeClick).not.toHaveBeenCalled();
  });

  it('starts the activity when online', () => {
    renderButtons(ActivityStatus.Available);

    fireEvent.click(screen.getByRole('button', { name: 'start' }));

    expect(onStartClick).toHaveBeenCalled();
    expect(screen.queryByTestId('no-internet-modal')).not.toBeInTheDocument();
  });
});

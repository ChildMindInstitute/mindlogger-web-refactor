import { fireEvent, screen, waitFor } from '@testing-library/react';

import { SignupForm } from './SignupForm';

import { SESSION_ELSEWHERE_KEY } from '~/shared/utils/session/session.const';
import { renderWithProviders } from '~/test/utils';

const signup = vi.fn();
const login = vi.fn();

vi.mock('~/entities/user', async () => {
  const actual = await vi.importActual<typeof import('~/entities/user')>('~/entities/user');

  return {
    ...actual,
    useSignupMutation: () => ({ mutate: signup, isLoading: false }),
    useLoginMutation: () => ({ mutate: login, isLoading: false }),
    userModel: {
      ...actual.userModel,
      hooks: { ...actual.userModel.hooks, useOnLogin: () => ({ onLoginSuccess: vi.fn() }) },
    },
  };
});

const createButton = () => screen.getByRole('button', { name: /create/i });

const fillIn = () => {
  fireEvent.change(screen.getByPlaceholderText('email'), { target: { value: 'a@example.com' } });
  fireEvent.change(screen.getByPlaceholderText('firstName'), { target: { value: 'Ann' } });
  fireEvent.change(screen.getByPlaceholderText('lastName'), { target: { value: 'Smith' } });
  fireEvent.change(screen.getByPlaceholderText('password'), { target: { value: 'Password1!' } });
  fireEvent.change(screen.getByPlaceholderText('confirmPassword'), {
    target: { value: 'Password1!' },
  });
  fireEvent.click(screen.getByLabelText(/iAgreeTo/i, { selector: 'input' }));
};

const renderSignupForm = () => renderWithProviders(<SignupForm />, {});

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
  });

  describe('while a session is running in another tab', () => {
    beforeEach(() => sessionStorage.setItem(SESSION_ELSEWHERE_KEY, 'true'));

    // signup succeeds and then calls login, so this is the second session by another door.
    it('neither signs up nor leaves the button usable', async () => {
      const { container } = renderSignupForm();

      fireEvent.submit(container.querySelector('form') as HTMLFormElement);

      await waitFor(() => expect(createButton()).toBeDisabled());
      expect(signup).not.toHaveBeenCalled();
      expect(login).not.toHaveBeenCalled();
    });

    // The guard sits ahead of validation, so an empty form is turned away rather than told off.
    it('turns an empty form away rather than validating it', async () => {
      const { container } = renderSignupForm();

      fireEvent.submit(container.querySelector('form') as HTMLFormElement);

      await waitFor(() => expect(createButton()).toBeDisabled());
      expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
    });

    it('leaves the button usable until it is pressed', () => {
      renderSignupForm();

      expect(createButton()).toBeEnabled();
    });
  });

  it('signs up as usual when no other session is running', async () => {
    const { container } = renderSignupForm();
    fillIn();

    fireEvent.submit(container.querySelector('form') as HTMLFormElement);

    await waitFor(() => expect(signup).toHaveBeenCalledTimes(1));
    expect(createButton()).toBeEnabled();
  });
});

import type { ReactElement, ReactNode } from 'react';

import Box from '@mui/material/Box';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormProvider, useForm } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PasswordRequirementsSection } from './index';

vi.mock('~/shared/utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('~/shared/utils')>();
  return {
    ...actual,
    useCustomTranslation: () => ({
      t: (key: string) => key,
    }),
  };
});

const theme = createTheme();

type TestFormValues = { new: string };

function FormHarness({
  defaultValues,
  children,
}: {
  defaultValues: TestFormValues;
  children: ReactNode;
}) {
  const methods = useForm<TestFormValues>({ defaultValues });
  return <FormProvider {...methods}>{children}</FormProvider>;
}

function renderWithTheme(ui: ReactElement) {
  return render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);
}

describe('PasswordRequirementsSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('without wrapper (no children)', () => {
    it('renders the checklist visible', () => {
      renderWithTheme(
        <FormHarness defaultValues={{ new: '' }}>
          <PasswordRequirementsSection
            fieldName="new"
            delayMs={0}
            setShowPasswordError={() => {}}
          />
        </FormHarness>,
      );
      expect(screen.getByTestId('password-requirements-section')).toBeVisible();
    });
  });

  describe('with wrapper (children)', () => {
    it('hides the checklist when password is empty and nothing is focused', () => {
      renderWithTheme(
        <FormHarness defaultValues={{ new: '' }}>
          <PasswordRequirementsSection fieldName="new" delayMs={0} setShowPasswordError={() => {}}>
            <input aria-label="New password" />
          </PasswordRequirementsSection>
        </FormHarness>,
      );
      expect(screen.getByTestId('password-requirements-section')).not.toBeVisible();
    });

    it('shows the checklist when the wrapped field is focused', async () => {
      const user = userEvent.setup();
      renderWithTheme(
        <FormHarness defaultValues={{ new: '' }}>
          <PasswordRequirementsSection fieldName="new" delayMs={0} setShowPasswordError={() => {}}>
            <input aria-label="New password" />
          </PasswordRequirementsSection>
        </FormHarness>,
      );
      const input = screen.getByLabelText('New password');
      await user.click(input);
      expect(input).toHaveFocus();
      await waitFor(() => {
        expect(screen.getByTestId('password-requirements-section')).toBeVisible();
      });
    });

    it('hides the checklist after blur when password is still empty', async () => {
      const user = userEvent.setup();
      renderWithTheme(
        <FormHarness defaultValues={{ new: '' }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <PasswordRequirementsSection
              fieldName="new"
              delayMs={0}
              setShowPasswordError={() => {}}
            >
              <input aria-label="New password" />
            </PasswordRequirementsSection>
            <input aria-label="Field outside password section" />
          </Box>
        </FormHarness>,
      );
      await user.click(screen.getByLabelText('New password'));
      await waitFor(() => {
        expect(screen.getByTestId('password-requirements-section')).toBeVisible();
      });
      await user.click(screen.getByLabelText('Field outside password section'));
      await waitFor(() => {
        expect(screen.getByTestId('password-requirements-section')).not.toBeVisible();
      });
    });

    it('keeps the checklist visible without focus when password fails length', () => {
      renderWithTheme(
        <FormHarness defaultValues={{ new: 'short' }}>
          <PasswordRequirementsSection fieldName="new" delayMs={0} setShowPasswordError={() => {}}>
            <input aria-label="New password" />
          </PasswordRequirementsSection>
        </FormHarness>,
      );
      expect(screen.getByTestId('password-requirements-section')).toBeVisible();
    });

    it('keeps the checklist visible without focus when password fails character-type rules', () => {
      renderWithTheme(
        <FormHarness defaultValues={{ new: 'onlyletterslongenough' }}>
          <PasswordRequirementsSection fieldName="new" delayMs={0} setShowPasswordError={() => {}}>
            <input aria-label="New password" />
          </PasswordRequirementsSection>
        </FormHarness>,
      );
      expect(screen.getByTestId('password-requirements-section')).toBeVisible();
    });

    it('hides the checklist when password meets policy and nothing is focused', () => {
      renderWithTheme(
        <FormHarness defaultValues={{ new: 'Goodpass1!' }}>
          <PasswordRequirementsSection fieldName="new" delayMs={0} setShowPasswordError={() => {}}>
            <input aria-label="New password" />
          </PasswordRequirementsSection>
        </FormHarness>,
      );
      expect(screen.getByTestId('password-requirements-section')).not.toBeVisible();
    });

    it('shows the checklist when password meets policy but the field is focused', async () => {
      const user = userEvent.setup();
      renderWithTheme(
        <FormHarness defaultValues={{ new: 'Goodpass1!' }}>
          <PasswordRequirementsSection fieldName="new" delayMs={0} setShowPasswordError={() => {}}>
            <input aria-label="New password" />
          </PasswordRequirementsSection>
        </FormHarness>,
      );
      const input = screen.getByLabelText('New password');
      await user.click(input);
      expect(input).toHaveFocus();
      await waitFor(() => {
        expect(screen.getByTestId('password-requirements-section')).toBeVisible();
      });
    });
  });
});

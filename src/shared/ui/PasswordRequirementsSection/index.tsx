import type { FocusEvent, ReactNode } from 'react';
import { useState } from 'react';

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';

import {
  StyledSection,
  StyledSectionTitle,
  StyledGrid,
  StyledRequirement,
} from './PasswordRequirementsSection.styles';

import { ACCOUNT_PASSWORD_MIN_LENGTH, ACCOUNT_PASSWORD_MIN_CHAR_TYPES } from '~/shared/constants';
import { useCustomTranslation } from '~/shared/utils';
import { checkPassword, isAccountPasswordPolicySatisfied } from '~/shared/utils/passwordValidation';

const RequirementItem = ({ met, label }: { met: boolean; label: string }) => (
  <StyledRequirement
    met={met}
    data-testid={`password-req-${label.replaceAll(' ', '-').toLowerCase()}`}
  >
    {met ? <CheckIcon /> : <CloseIcon />} {label}
  </StyledRequirement>
);

interface PasswordRequirementsSectionProps {
  password: string;
  /**
   * If passed, wraps fields + checklist. The checklist shows while a descendant has focus, or while
   * `password` is non-empty and still fails account policy (stable while typing despite debounced validation).
   */
  children?: ReactNode;
}

export const PasswordRequirementsSection = ({
  password,
  children,
}: PasswordRequirementsSectionProps) => {
  // If focusWithin is true, the user is inside the component and the checklist should be visible.
  const [focusWithin, setFocusWithin] = useState(false);
  const { t } = useCustomTranslation({ keyPrefix: 'validation' });

  const result = checkPassword(password);

  const checklist = (
    <div data-testid="password-requirements-section">
      <StyledSection>
        <StyledSectionTitle>{t('passwordMustInclude')}</StyledSectionTitle>
        <StyledGrid>
          <RequirementItem
            met={result.meetsLength}
            label={t('passwordReqLength', { chars: ACCOUNT_PASSWORD_MIN_LENGTH })}
          />
          <RequirementItem met={result.hasNoSpaces} label={t('passwordReqNoSpaces')} />
        </StyledGrid>
      </StyledSection>
      <StyledSection>
        <StyledSectionTitle>
          {t('passwordReqCharTypesHeading', { types: ACCOUNT_PASSWORD_MIN_CHAR_TYPES })}
        </StyledSectionTitle>
        <StyledGrid>
          <RequirementItem
            met={result.hasUppercase || result.meetsCharTypeRequirement}
            label={t('passwordReqUppercase')}
          />
          <RequirementItem
            met={result.hasLowercase || result.meetsCharTypeRequirement}
            label={t('passwordReqLowercase')}
          />
          <RequirementItem
            met={result.hasDigit || result.meetsCharTypeRequirement}
            label={t('passwordReqNumbers')}
          />
          <RequirementItem
            met={result.hasSymbol || result.meetsCharTypeRequirement}
            label={t('passwordReqSymbols')}
          />
        </StyledGrid>
      </StyledSection>
    </div>
  );

  if (children !== undefined) {
    const keepChecklistVisible = password.length > 0 && !isAccountPasswordPolicySatisfied(result);
    const showPasswordPanel = keepChecklistVisible || focusWithin;

    /** Only turn off focusWithin if the user actually leaves the component entirely. */
    const handleBlurCapture = (e: FocusEvent<HTMLDivElement>) => {
      const next = e.relatedTarget as Node | null;
      if (next && e.currentTarget.contains(next)) return;
      setFocusWithin(false);
    };

    return (
      <Box
        data-testid="password-requirements-field-group"
        display="flex"
        flexDirection="column"
        onFocusCapture={() => setFocusWithin(true)}
        onBlurCapture={handleBlurCapture}
        sx={{
          '& > .password-requirements-panel': {
            minHeight: 0,
            overflow: 'hidden',
            transition:
              'opacity 0.2s ease-in-out, max-height 0.25s ease-in-out, margin-top 0.2s ease-in-out',
            ...(showPasswordPanel // Show the password requirements panel when the user is inside the component or the password still fails account policy.
              ? { opacity: 1, maxHeight: 320, marginTop: '24px' }
              : { opacity: 0, maxHeight: 0, marginTop: 0 }),
          },
        }}
      >
        <Box display="flex" flexDirection="column" gap="24px">
          {children}
        </Box>
        <Box className="password-requirements-panel" data-testid="password-requirements-panel">
          {checklist}
        </Box>
      </Box>
    );
  }

  return checklist;
};

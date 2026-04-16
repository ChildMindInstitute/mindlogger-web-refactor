import { useEffect, useRef, useState } from 'react';

import {
  checkPassword,
  isAccountPasswordPolicySatisfied,
  type PasswordCheckResult,
} from '~/shared/utils/passwordValidation';

export const DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS = 500;

function passwordRequirementsSectionTitleKey(
  displayCheck: PasswordCheckResult,
  displayPolicySatisfied: boolean,
): 'passwordMustIncludeMinimum' | 'passwordRequirementsMet' | 'passwordMustInclude' {
  if (displayPolicySatisfied) {
    return 'passwordRequirementsMet';
  }
  if (
    displayCheck.meetsCharTypeRequirement &&
    (!displayCheck.hasNoSpaces || !displayCheck.meetsLength)
  ) {
    return 'passwordMustIncludeMinimum';
  }
  return 'passwordMustInclude';
}

/**
 * Live `checkPassword` plus debounced UI flags: hide the 4-type grid and show “all met” only after
 * `debounceMs` with no `password` change (immediate reset when those conditions become false).
 * Title copy uses the same debounced snapshot so it stays in sync with grid visibility and “met”.
 */
export function usePasswordRequirementsChecklistDisplay(
  password: string,
  debounceMs: number = DEFAULT_PASSWORD_CHECKLIST_DEBOUNCE_MS,
) {
  const result = checkPassword(password);
  const meetsCharTypeRequirement = result.meetsCharTypeRequirement;
  const livePolicySatisfied = isAccountPasswordPolicySatisfied(result);

  const [hideCharTypesGrid, setHideCharTypesGrid] = useState(() => meetsCharTypeRequirement);
  const [displayPolicySatisfied, setDisplayPolicySatisfied] = useState(() => livePolicySatisfied);
  const [displayCheckResult, setDisplayCheckResult] = useState(() => checkPassword(password));

  const passwordRef = useRef(password);
  passwordRef.current = password;

  useEffect(() => {
    const live = checkPassword(passwordRef.current);

    if (!meetsCharTypeRequirement) {
      setHideCharTypesGrid(false);
      setDisplayCheckResult(live);
    }
    if (!livePolicySatisfied) {
      setDisplayPolicySatisfied(false);
      setDisplayCheckResult(live);
    }

    const id = window.setTimeout(() => {
      const latest = checkPassword(passwordRef.current);
      setHideCharTypesGrid(latest.meetsCharTypeRequirement);
      setDisplayPolicySatisfied(isAccountPasswordPolicySatisfied(latest));
      setDisplayCheckResult(latest);
    }, debounceMs);

    return () => window.clearTimeout(id);
  }, [password, meetsCharTypeRequirement, livePolicySatisfied, debounceMs]);

  return {
    result,
    hideCharTypesGrid,
    displayPolicySatisfied,
    passwordRequirementsSectionTitleKey: passwordRequirementsSectionTitleKey(
      displayCheckResult,
      displayPolicySatisfied,
    ),
  };
}

import { styled, tooltipClasses, Tooltip, TooltipProps } from '@mui/material';
import Box from '@mui/material/Box';

import { variables } from '~/shared/constants/theme/variables';

export const StyledPasswordTooltip = styled(({ className, children, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }}>
    {children}
  </Tooltip>
))(() => ({
  [`&& .${tooltipClasses.tooltip}`]: {
    backgroundColor: variables.palette.white,
    color: variables.palette.onSurface,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.15)',
    padding: '12.8px 16px',
    maxWidth: '26rem',
  },
}));

export const StyledSection = styled(Box)`
  margin-bottom: 9.6px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export const StyledSectionTitle = styled('div')`
  font-size: ${variables.font.size.body2};
  font-weight: ${variables.font.weight.bold};
  line-height: ${variables.font.lineHeight.body2};
  color: ${variables.palette.onSurface};
  margin-bottom: 3.2px;
`;

export const StyledGrid = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3.2px 12.8px;
`;

export const StyledRequirement = styled('div')<{ met: boolean }>`
  display: flex;
  align-items: center;
  gap: 3.2px;
  font-size: ${variables.font.size.body2};
  line-height: ${variables.font.lineHeight.body2};
  color: ${({ met }) => (met ? variables.palette.green : variables.palette.error60)};
`;

export const StyledInfoIcon = styled('span')`
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  && svg {
    fill: ${variables.palette.outline};
    width: 1.8rem;
    height: 1.8rem;
  }
`;

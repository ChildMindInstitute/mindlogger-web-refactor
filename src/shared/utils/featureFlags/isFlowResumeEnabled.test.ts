import { describe, expect, it } from 'vitest';

import { isFlowResumeEnabled } from './isFlowResumeEnabled';

describe('isFlowResumeEnabled', () => {
  it('should return true when flag contains wildcard', () => {
    expect(isFlowResumeEnabled(['*'], 'applet-1')).toBe(true);
  });

  it('should return true when flag contains the applet ID', () => {
    expect(isFlowResumeEnabled(['applet-1', 'applet-2'], 'applet-1')).toBe(true);
  });

  it('should return false when flag does not contain the applet ID', () => {
    expect(isFlowResumeEnabled(['applet-2', 'applet-3'], 'applet-1')).toBe(false);
  });

  it('should return false when flag is an empty array', () => {
    expect(isFlowResumeEnabled([], 'applet-1')).toBe(false);
  });
});

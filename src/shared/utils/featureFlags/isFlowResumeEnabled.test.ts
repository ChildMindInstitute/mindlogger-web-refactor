import { describe, expect, it } from 'vitest';

import { isFlowResumeEnabled } from './isFlowResumeEnabled';

describe('isFlowResumeEnabled', () => {
  it('should return true when flag is true', () => {
    expect(isFlowResumeEnabled(true, 'applet-1')).toBe(true);
  });

  it('should return false when flag is false', () => {
    expect(isFlowResumeEnabled(false, 'applet-1')).toBe(false);
  });

  it('should return true when flag is an array containing the applet ID', () => {
    expect(isFlowResumeEnabled(['applet-1', 'applet-2'], 'applet-1')).toBe(true);
  });

  it('should return false when flag is an array not containing the applet ID', () => {
    expect(isFlowResumeEnabled(['applet-2', 'applet-3'], 'applet-1')).toBe(false);
  });

  it('should return false when flag is an empty array', () => {
    expect(isFlowResumeEnabled([], 'applet-1')).toBe(false);
  });
});

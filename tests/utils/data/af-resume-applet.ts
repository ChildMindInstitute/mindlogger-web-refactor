import crypto from 'node:crypto';

import { AppletEncryption } from '../encryption';

// Builders for the AF Resume (M2-8431) test applet:
// one flow of 3 single-select activities + 2 standalone activities.

export const AF_FLOW_NAME = 'AF Resume Flow';
// Same activities, but autoAssign=false: only visible once manually assigned.
export const AF_MANUAL_FLOW_NAME = 'AF Manual Flow';
export const AF_FLOW_ACTIVITY_NAMES = ['AF Activity 1', 'AF Activity 2', 'AF Activity 3'];
export const AF_STANDALONE_ACTIVITY_NAMES = ['AF Standalone 1', 'AF Standalone 2'];

const buildSingleSelectItem = (name: string, question: string) => ({
  responseType: 'singleSelect',
  name,
  question: { en: question },
  config: {
    removeBackButton: false,
    skippableItem: false,
    randomizeOptions: false,
    addScores: false,
    setAlerts: false,
    addTooltip: false,
    setPalette: false,
    timer: 0,
    additionalResponseOption: { textInputOption: false, textInputRequired: false },
    portraitLayout: false,
    autoAdvance: false,
    responseDataIdentifier: false,
  },
  isHidden: false,
  allowEdit: true,
  responseValues: {
    options: [
      { id: crypto.randomUUID(), text: 'Option 1', isHidden: false, value: 0 },
      { id: crypto.randomUUID(), text: 'Option 2', isHidden: false, value: 1 },
    ],
  },
});

const buildActivity = (name: string, key: string) => ({
  name,
  description: { en: name },
  showAllAtOnce: false,
  isSkippable: false,
  responseIsEditable: true,
  isHidden: false,
  autoAssign: true,
  isReviewable: false,
  items: [buildSingleSelectItem(`${name} Item`, `${name} question`)],
  scoresAndReports: { generateReport: false, reports: [], showScoreSummary: false },
  key,
  reportIncludedItemName: '',
});

export const buildAfResumeAppletPayload = ({
  displayName,
  encryption,
}: {
  displayName: string;
  encryption: AppletEncryption;
}) => {
  const flowActivityKeys = AF_FLOW_ACTIVITY_NAMES.map(() => crypto.randomUUID());
  const standaloneActivityKeys = AF_STANDALONE_ACTIVITY_NAMES.map(() => crypto.randomUUID());

  return {
    displayName,
    description: { en: 'AF Resume (M2-8431) automated test applet' },
    themeId: null,
    about: { en: '' },
    image: '',
    watermark: '',
    activities: [
      ...AF_FLOW_ACTIVITY_NAMES.map((name, i) => buildActivity(name, flowActivityKeys[i])),
      ...AF_STANDALONE_ACTIVITY_NAMES.map((name, i) =>
        buildActivity(name, standaloneActivityKeys[i]),
      ),
    ],
    activityFlows: [
      {
        name: AF_FLOW_NAME,
        description: { en: 'Three-activity flow for resume scenarios' },
        isSingleReport: false,
        hideBadge: false,
        isHidden: false,
        autoAssign: true,
        items: flowActivityKeys.map((activityKey) => ({ activityKey })),
      },
      {
        name: AF_MANUAL_FLOW_NAME,
        description: { en: 'Manually assigned flow for resume scenarios' },
        isSingleReport: false,
        hideBadge: false,
        isHidden: false,
        autoAssign: false,
        items: flowActivityKeys.map((activityKey) => ({ activityKey })),
      },
    ],
    reportEmailBody: 'Please see the report attached to this email.',
    streamIpAddress: null,
    streamPort: null,
    encryption,
  };
};

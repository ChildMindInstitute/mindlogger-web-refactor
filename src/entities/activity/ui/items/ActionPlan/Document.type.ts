import React from 'react';

import { PhrasalTemplatePhrase } from '~/entities/activity';

export type IdentifiablePhrasalTemplatePhrase = PhrasalTemplatePhrase & { id: string };

// This should be kept in a separate file from `Document` because both `Document` and `Page` need
// this context, but `Document` also needs `Page`. So keeping this context in this separate file
// avoids a circular import path.
export const DocumentContext = React.createContext<{
  totalPages: number;
}>({
  totalPages: 0,
});

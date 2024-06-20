import React from 'react';

export const PDFDocumentContext = React.createContext<{
  totalPages: number;
}>({
  totalPages: 0,
});

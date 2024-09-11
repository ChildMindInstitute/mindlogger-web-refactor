import React from 'react';

export const DocumentContext = React.createContext<{
  totalPages: number;
}>({
  totalPages: 0,
});

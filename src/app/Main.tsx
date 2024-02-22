import React from 'react';

import ReactDOM from 'react-dom/client';

import AppSuspense from './AppSuspense';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppSuspense />
  </React.StrictMode>,
);

import React from 'react';

import { createRoot } from 'react-dom/client';

export async function measureComponentHeight(parentWidth: number, Component: React.FC) {
  const tempContainer = document.createElement('div');
  tempContainer.style.visibility = 'hidden';
  tempContainer.style.width = `${parentWidth}px`;
  document.body.appendChild(tempContainer);
  const tempRoot = createRoot(tempContainer);
  tempRoot.render(<Component />);
  return await new Promise<number>((resolve) => {
    const observer = new MutationObserver(() => {
      const measuredHeight = tempContainer.getBoundingClientRect().height;
      resolve(measuredHeight);
      tempRoot.unmount();
      document.body.removeChild(tempContainer);
      observer.disconnect();
    });

    observer.observe(tempContainer, { childList: true, subtree: true });
  });
}

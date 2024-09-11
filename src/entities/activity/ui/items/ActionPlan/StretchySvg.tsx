import { SVGProps } from 'react';

export const StretchySvg = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    preserveAspectRatio="none"
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      objectFit: 'fill',
    }}
  />
);

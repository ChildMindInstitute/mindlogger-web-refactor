import { PropsWithChildren } from 'react';

import { animated, useTransition } from '@react-spring/web';

import { useSliderAnimation } from './useSliderAnimation';

type Props = PropsWithChildren<{
  step: number;
  prevStep: number;
}>;

export const SliderAnimation = (props: Props) => {
  const { getDirection, getTransitionConfig } = useSliderAnimation();

  const direction = getDirection(props.step, props.prevStep);

  const transitions = useTransition(props.step, {
    ...getTransitionConfig(direction),
  });

  return transitions(style => <animated.div style={{ flex: 1, ...style }}>{props.children}</animated.div>);
};

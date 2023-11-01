import { ISwipeableActionGroup } from './types';

export const createColorInputRange = (
  actionGroup: ISwipeableActionGroup
): number[] => {
  'worklet';

  const { firstStep, secondStep } = actionGroup;

  if (secondStep == null) {
    return [0, firstStep.triggerThreshold * 0.5];
  } else {
    return [
      0,
      firstStep.triggerThreshold * 0.5,
      firstStep.triggerThreshold * 1.35,
      secondStep.triggerThreshold,
    ];
  }
};

export const clamp = (number: number, min: number, max: number): number => {
  'worklet';

  return Math.max(min, Math.min(number, max));
};

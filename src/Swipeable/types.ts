import React from 'react';
import { SharedValue } from 'react-native-reanimated';
import { SpringConfig } from 'react-native-reanimated/lib/typescript/reanimated2/animation/springUtils';

export interface ISwipeableProps {
  leftActionGroup?: ISwipeableActionGroup;
  rightActionGroup?: ISwipeableActionGroup;

  options?: Partial<ISwipeableOptions>;
  children: React.ReactNode;
}

export interface ISwipeableOptions {
  activeOffset: number[];
  maxPointers: number;
  overshootClamping: boolean;
  iconPopScale: number;
  onHitStep?: () => unknown;
  animationOptions: Partial<SpringConfig>;
}

export interface ISwipeableContext {
  options: ISwipeableOptions;
  translationX: SharedValue<number>;
  isActive: SharedValue<boolean>;
}

export interface ISwipeableAction {
  onAction?: (actionParamObject?: object) => unknown;
  actionParamObject?: object;
  icon: () => React.JSX.Element;
  backgroundColor: string;
  triggerThreshold: number;
}

export interface ISwipeableActionGroup {
  firstStep: ISwipeableAction;
  secondStep?: ISwipeableAction;
}

export const defaultSwipeableAnimationOptions: SpringConfig = {
  mass: 1,
  damping: 5,
  stiffness: 100,
  overshootClamping: true,
  restDisplacementThreshold: 0.01,
  restSpeedThreshold: 0.01,
};

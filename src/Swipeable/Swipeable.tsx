import React, { useCallback } from 'react';
import {
  defaultSwipeableAnimationOptions,
  ISwipeableOptions,
  ISwipeableProps,
} from './types';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  clamp,
} from 'react-native-reanimated';
import SwipeableSide from './SwipeableSide';
import { SwipeableContext } from './SwipeableContext';
import { SpringConfig } from 'react-native-reanimated/lib/typescript/reanimated2/animation/springUtils';

const SCREEN_WIDTH = Dimensions.get('screen').width;

export default function Swipeable({
  rightActionGroup,
  leftActionGroup,
  options,
  children,
}: ISwipeableProps): React.JSX.Element {
  // Define the default options
  const swipeableOptions: ISwipeableOptions = {
    activeOffset: [-20, 20],
    maxPointers: 1,
    overshootClamping: true,
    iconPopScale: 1.2,
    animationOptions: {},
    onHitStep: undefined,
    ...options,
  };

  const translationX = useSharedValue(0);
  const isActive = useSharedValue(false);

  // Set isActive to true once we begin a gesture
  const onPanBegin = useCallback(() => {
    'worklet';

    isActive.value = true;
  }, [isActive]);

  // Update the translation on each update
  const onPanUpdate = useCallback(
    (e: GestureUpdateEvent<PanGestureHandlerEventPayload>): void => {
      'worklet';

      // Update the row's position to the new position
      // If one of the groups is missing we should clamp the min and max
      translationX.value = clamp(
        e.translationX,
        rightActionGroup != null ? -SCREEN_WIDTH : 0,
        leftActionGroup != null ? SCREEN_WIDTH : 0
      );
    },
    [leftActionGroup, rightActionGroup, translationX]
  );

  /*
   * Once finished, we want to do a few things. First, we want to return the
   * position of the row to zero. We also want to determine which action we are
   * going to run.
   */
  const onPanEnd = useCallback(
    (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>): void => {
      'worklet';

      // Create the animation options
      const animationOptions = {
        ...defaultSwipeableAnimationOptions,
        ...swipeableOptions.animationOptions,
      };

      // Reset position to zero with a spring. The decay's velocity will start at
      // the velocity of the pan gesture and decay to zero.
      translationX.value = withSpring(0, animationOptions as SpringConfig);

      // Run whatever action is appropriate
      const absTranslation = Math.abs(e.translationX);

      if (e.translationX > 0 && leftActionGroup != null) {
        if (
          leftActionGroup.secondStep != null &&
          absTranslation >= leftActionGroup.secondStep.triggerThreshold
        ) {
          runOnJS(leftActionGroup.secondStep.onAction)();
        } else if (
          absTranslation >= leftActionGroup.firstStep.triggerThreshold
        ) {
          runOnJS(leftActionGroup.firstStep.onAction)();
        }
      } else if (e.translationX < 0 && rightActionGroup != null) {
        if (
          rightActionGroup.secondStep != null &&
          absTranslation >= rightActionGroup.secondStep.triggerThreshold
        ) {
          runOnJS(rightActionGroup.secondStep.onAction)();
        } else if (
          absTranslation >= rightActionGroup.firstStep.triggerThreshold
        ) {
          runOnJS(rightActionGroup.firstStep.onAction)();
        }
      }
    },
    [
      swipeableOptions.animationOptions,
      translationX,
      leftActionGroup,
      rightActionGroup,
    ]
  );

  /*
   * Once the pan is finalized, we want to set isActive to false. This will
   * prevent the icon or background color from changing until the row returns to
   * a position of zero.
   */
  const onPanFinalize = useCallback(() => {
    'worklet';

    isActive.value = false;
  }, [isActive]);

  // Create an animated style for the children
  const childrenStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translationX.value }],
  }));

  // Create the pan gesture handler
  const panGesture = Gesture.Pan()
    .activeOffsetX(swipeableOptions.activeOffset)
    .hitSlop({ left: 20, right: 20 }) // Add hitslop for swipe to go back in navigation
    .maxPointers(swipeableOptions.maxPointers)
    .onBegin(onPanBegin)
    .onUpdate(onPanUpdate)
    .onEnd(onPanEnd)
    .onFinalize(onPanFinalize);

  return (
    <View style={styles.container}>
      <SwipeableContext.Provider
        value={{
          options: swipeableOptions,
          isActive,
          translationX,
        }}
      >
        <View style={[styles.actionsContainer]}>
          {leftActionGroup != null && (
            <Animated.View style={[styles.action]}>
              <SwipeableSide side="left" actionGroup={leftActionGroup} />
            </Animated.View>
          )}
          {rightActionGroup != null && (
            <Animated.View style={[styles.action]}>
              <SwipeableSide side="right" actionGroup={rightActionGroup} />
            </Animated.View>
          )}
        </View>
      </SwipeableContext.Provider>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={childrenStyle}>{children}</Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  actionsContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },

  action: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
  },
});

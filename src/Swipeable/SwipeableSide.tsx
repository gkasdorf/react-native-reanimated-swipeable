import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import { ISwipeableActionGroup } from './types';
import { createColorInputRange } from './util';
import { useSwipeableContext } from './SwipeableContext';
import Animated, {
  interpolateColor,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

interface ISwipeableSideProps {
  side: 'left' | 'right';
  actionGroup: ISwipeableActionGroup;
}

export default function SwipeableSide({
  side,
  actionGroup,
}: ISwipeableSideProps): React.JSX.Element {
  const swipeable = useSwipeableContext();
  const { options, translationX, isActive } = swipeable;
  const { firstStep, secondStep } = actionGroup;

  const [icon, setIcon] = useState(0);
  const iconScale = useSharedValue(1);

  // Create our input range
  const inputRange = useMemo(
    () => createColorInputRange(actionGroup),
    [actionGroup]
  );

  // Weird that we have to do this, but an ongoing bug in Reanimated that should
  // be fixed in 3.6
  const FirstIcon = useMemo(() => actionGroup.firstStep.icon, [actionGroup]);
  const SecondIcon = useMemo(() => actionGroup.secondStep?.icon, [actionGroup]);

  /*
   * Function we run when poping the icon and playing a haptic
   */
  const popIcon = useCallback(() => {
    'worklet';

    iconScale.value = withSequence(
      withTiming(options.iconPopScale, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );

    // Run onHitStep if it is defined
    if (options.onHitStep != null) {
      runOnJS(options.onHitStep)();
    }
  }, [iconScale, options.iconPopScale, options.onHitStep]);

  /*
   * Create a reaction to the translation. We use this to run the icon animations.
   */
  useAnimatedReaction(
    () => ({
      translationX: translationX.value,
      isActive: isActive.value,
    }),
    (current, previous) => {
      // Create absolute values for the current and previous translations
      const curr = Math.abs(current.translationX ?? 0);
      const prev = Math.abs(previous?.translationX ?? 0);

      // Check first if we should reset the icon
      if (!current.isActive) {
        if (curr < 1) {
          runOnJS(setIcon)(0);
        }

        return;
      }

      // Don't do anything if the other side is open
      if (
        (side === 'left' && current.translationX <= 0) ||
        (side === 'right' && current.translationX >= 0)
      ) {
        return;
      }

      // Check the second step first
      if (
        secondStep != null &&
        curr >= secondStep?.triggerThreshold &&
        prev < secondStep?.triggerThreshold
      ) {
        runOnJS(setIcon)(1);
        popIcon();
      } else if (
        secondStep != null &&
        curr < secondStep?.triggerThreshold &&
        prev > secondStep?.triggerThreshold
      ) {
        // Next check if we need to reset the icon back to the first one. Pop
        // if we do.
        runOnJS(setIcon)(0);
        popIcon();
      } else if (
        curr >= firstStep.triggerThreshold &&
        prev <= firstStep.triggerThreshold
      ) {
        // Otherwise we check if we should pop the first icon
        popIcon();
      }
    }
  );

  /*
   * Create our colored background style.
   */
  const backgroundStyle = useAnimatedStyle(() => {
    // If we are opening the other side, this side should be transparent
    if (
      (side === 'left' && translationX.value <= 0) ||
      (side === 'right' && translationX.value >= 0)
    ) {
      return {
        backgroundColor: 'transparent',
      };
    }

    // Don't change the background color after releasing
    if (!isActive.value) {
      return {};
    }

    // If the second setup is not defined, we are only transitioning to the first
    // color
    if (secondStep == null) {
      return {
        backgroundColor: interpolateColor(
          Math.abs(translationX.value),
          inputRange,
          ['transparent', firstStep.backgroundColor]
        ),
      };
    } else {
      // Otherwise we need to transition between both colors
      return {
        backgroundColor: interpolateColor(
          Math.abs(translationX.value),
          inputRange,
          [
            'transparent',
            firstStep.backgroundColor,
            firstStep.backgroundColor,
            secondStep.backgroundColor,
          ]
        ),
      };
    }
  });

  /*
   * Create icon style that adjusts the scale of the icon
   */
  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: iconScale.value,
      },
    ],
  }));

  return (
    <Animated.View
      style={[
        styles.container,
        ...(side === 'left' ? [styles.leftContainer] : [styles.rightContainer]),
        backgroundStyle,
      ]}
    >
      <Animated.View style={[iconStyle]}>
        {icon === 0 || SecondIcon == null ? <FirstIcon /> : <SecondIcon />}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },

  leftContainer: {
    alignItems: 'flex-start',
    paddingLeft: 10,
  },

  rightContainer: {
    alignItems: 'flex-end',
    paddingRight: 10,
  },
});

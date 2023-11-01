# 👉 React Native Reanimated Swipeable 💨

A performant and configurable swipeable row using Reanimated and React Native Gesture Handler

## Installation

This package has only two dependencies, [Reanimated](https://github.com/software-mansion/react-native-reanimated) and [React Native Gesture Handler](https://github.com/software-mansion/react-native-gesture-handler).
You are likely already using these packages however, and you will be able to use this package even if you are using Expo Go!

```sh
npm install react-native-reanimated-swipeable
# or
yarn add react-native-reanimated-swipeable
```

In favor of allowing this package to be used by Expo Go users, no haptics functionality is included. However, it is
*highly* recommended. Depending on your setup, you can either use [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) or [React Native Haptic Feedback](https://github.com/mkuczera/react-native-haptic-feedback).

## Usage

### Swipeable

| Prop               | Type                    |
|--------------------|-------------------------|
| `leftActionGroup`  | `ISwipeableActionGroup` |
| `rightActionGroup` | `ISwipeableActionGroup` |
| `options?`         | `ISwipeableOptions`     |


### Options

| Option             | Type             | Default           | Description                                                                     |
|--------------------|------------------|-------------------|---------------------------------------------------------------------------------|
| `iconPopScale`     | `number`         | `1.2`             | The scale to animate the icon to when the user swipes past a trigger threshold. |
| `onHitStep?`       | `() => unknown`  | `undefined`       | The function to call when the user swipes past a trigger threshold.             |
| `animationOptions` | `SpringConfig`   | See Spring Config | The configuration for the spring animation when closing the row.                |


### Spring Config
| Option                       | Type       | Default | Description                                          |
|------------------------------|------------|---------|------------------------------------------------------|
| `damping`                    | `number`   | `5`     | The damping of the spring animation.                 |
| `mass`                       | `number`   | `1`     | The mass of the spring animation.                    |
| `stiffness`                  | `number`   | `100`   | The stiffness of the spring animation.               |
| `overshootClamping`          | `boolean`  | `true`  | Whether or not to clamp the spring animation.        |
| `restSpeedThreshold`         | `number`   | `0.01`  | The speed threshold of the spring animation.         |
| `restDisplacementThreshold`  | `number`   | `0.01`  | The displacement threshold of the spring animation.  |

For more information, see the [Reanimated documentation](https://docs.swmansion.com/react-native-reanimated/docs/1.x/animations/spring/).


### Action Group Options
| Option       | Type               | Description                                |
|--------------|--------------------|--------------------------------------------|
| `firstStep`  | `ISwipeableAction` | The first action to display for the side.  |
| `secondStep` | `ISwipeableAction` | The second action to display for the side. |

### Action Options

| Option             | Type                    | Description                                                                                                                                                     |
|--------------------|-------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `icon`             | `() => React.ReactNode` | The icon to display for the action                                                                                                                              |
| `backgroundColor`  | `string`                | The background color of the action                                                                                                                              |
| `triggerThreshold` | `number`                | The threshold in pixels that the user must swipe past in order to trigger the action. This number should always be positive, regardless of which side it is on. |
| `onAction`         | `() => unknown`         | The function to call when the action is pressed. If you do not pass this function, the action will not be pressable.                                            |

### Example
```tsx
<Swipeable
  leftActionGroup={{
    firstStep: {
      icon: () => <Icon name="trash" />,
      backgroundColor: 'red',
      triggerThreshold: 50,
      onAction: () => console.log('first step pressed'),
    },
    secondStep: {
      icon: () => <Icon name="archive" />,
      backgroundColor: 'blue',
      triggerThreshold: 100,
      onAction: () => console.log('second step pressed'),
    },
  }}
  rightActionGroup={{
    firstStep: {
      icon: () => <Icon name="trash" />,
      backgroundColor: 'red',
      triggerThreshold: 50,
      onAction: () => console.log('first step pressed'),
    },
    secondStep: {
      icon: () => <Icon name="archive" />,
      backgroundColor: 'blue',
      triggerThreshold: 100,
      onAction: () => console.log('second step pressed'),
    },
  }}
>
  <View style={{ height: 100, width: '100%', backgroundColor: 'green'}}>
    <Text>Hello! I am a row! Give me a quick swipe!</Text>
  </View>
</Swipeable>
```

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)

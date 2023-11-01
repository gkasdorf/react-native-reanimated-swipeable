import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import { Swipeable } from 'react-native-reanimated-swipeable';
import { Ionicons } from '@expo/vector-icons';

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const renderItem = ({ item }: ListRenderItemInfo) => {
  return (
    <Swipeable
      rightActionGroup={{
        firstStep: {
          icon: () => <Ionicons name="arrow-up-outline" size={40} />,
          onAction: () => console.log('First Step Right'),
          backgroundColor: 'blue',
          triggerThreshold: 80,
        },
        secondStep: {
          icon: () => <Ionicons name="arrow-down-outline" size={40} />,
          onAction: () => console.log('Second Step Right'),
          backgroundColor: 'red',
          triggerThreshold: 150,
        },
      }}
    >
      <View
        style={{
          height: 100,
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: item % 2 === 0 ? 'yellow' : 'orange',
        }}
      >
        <Text>Hi, I'm a row!</Text>
      </View>
    </Swipeable>
  );
};

export default function App() {
  return (
    <View style={styles.container}>
      <FlatList data={data} renderItem={renderItem} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

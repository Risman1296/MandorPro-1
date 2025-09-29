import React, { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';

export default function PageContainer({ children }: PropsWithChildren) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8fafc',
  },
});

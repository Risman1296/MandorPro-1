import React, { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';

type Props = PropsWithChildren<{ fluid?: boolean }>

export default function PageContainer({ children, fluid }: Props) {
  return (
    <View style={styles.root}>
      <View style={[styles.content, fluid && styles.fluid]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, minHeight: 0 },
  content: {
    flex: 1,
    width: '100%',
    padding: 16,
    backgroundColor: '#f8fafc',
    minWidth: 0,
    minHeight: 0,
  },
  fluid: { maxWidth: '100%', alignSelf: 'stretch' },
});

import React, { PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import { fill, layout } from '@/src/ui/tokens';

type Props = PropsWithChildren<{ fluid?: boolean }>

export default function PageContainer({ children, fluid }: Props) {
  const l = layout();
  return (
    <View style={styles.root}>
      <View style={[styles.content, { padding: l.contentPadding }, fluid && styles.fluid]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { ...fill },
  content: {
    flex: 1,
    width: '100%',
    backgroundColor: '#f8fafc',
    minWidth: 0,
    minHeight: 0,
  },
  fluid: { maxWidth: '100%', alignSelf: 'stretch' },
});

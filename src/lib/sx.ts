import { StyleSheet, ViewStyle, TextStyle, ImageStyle } from 'react-native';

type RNBase = ViewStyle | TextStyle | ImageStyle;
export type RNStyle = RNBase | false | null | undefined;

export const sx = (...items: RNStyle[]) => StyleSheet.flatten(items as RNBase[]);

import { Platform, ViewStyle } from 'react-native';

// Cross-platform shadow utility
export const cardShadow: ViewStyle = Platform.select({
  web: { 
    boxShadow: '0 6px 20px rgba(0,0,0,0.12)' 
  },
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  android: { 
    elevation: 6 
  },
})!;

export const buttonShadow: ViewStyle = Platform.select({
  web: { 
    boxShadow: '0 3px 10px rgba(0,0,0,0.1)' 
  },
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  android: { 
    elevation: 3 
  },
})!;

export const headerShadow: ViewStyle = Platform.select({
  web: { 
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)' 
  },
  ios: {
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  android: { 
    elevation: 2 
  },
})!;
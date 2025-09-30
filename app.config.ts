import type { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => {
  // Prefer EAS File Secret named GOOGLE_SERVICES_JSON; fallback to local file
  const googleServicesFile = process.env.GOOGLE_SERVICES_JSON || './google-services.json';

  return {
    // Base from app.json
    name: 'MandorPro',
    slug: 'MandorPro',
    scheme: 'mandorpro',
    version: '1.0.1',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    newArchEnabled: true,
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      package: 'com.risman.mandorpro',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      googleServicesFile,
      versionCode: 2,
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-router',
      'expo-font',
      'expo-notifications',
      'expo-sqlite',
      [
        'expo-build-properties',
        {
          android: {
            minSdkVersion: 24,
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            enableProguardInReleaseBuilds: true,
          },
        },
      ],
    ],
    extra: {
      router: {},
      eas: {
        projectId: '92a6917b-7c50-4b6f-9491-d108b724e30d',
      },
    },
    owner: 'risman24',
  } as ExpoConfig;
};

import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.chatterbots',
  appName: 'chatterbots',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

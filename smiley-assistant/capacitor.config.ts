import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smiley.assistant',
  appName: 'Smiley\'s Assistant',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;

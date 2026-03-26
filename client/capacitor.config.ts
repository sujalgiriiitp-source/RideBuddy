import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'com.ridebuddy.app',
  appName: 'RideBuddy',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    buildOptions: {
      sourceCompatibility: '17',
      targetCompatibility: '17',
    },
  },
}

export default config

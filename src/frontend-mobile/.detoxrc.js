/** @type {Detox.DetoxConfig} */
module.exports = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'e2e/jest.config.js',
    },
    jest: {
      setupTimeout: 120000,
    },
  },
  apps: {
    // macOS / Linux — uses ./gradlew
    'android.debug': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build:
        'cd android && ./gradlew :app:assembleDebug :app:assembleAndroidTest -DtestBuildType=debug && cd ..',
      reversePorts: [8081],
    },
    // Windows — uses gradlew (gradlew.bat); ./gradlew fails in cmd.exe
    'android.debug.win': {
      type: 'android.apk',
      binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
      build:
        'cd android && gradlew :app:assembleDebug :app:assembleAndroidTest -DtestBuildType=debug && cd ..',
      reversePorts: [8081],
    },
  },
  devices: {
    emulator: {
      type: 'android.emulator',
      device: {
        // Must match an AVD you have created locally (see `emulator -list-avds`).

        avdName: 'Pixel_8_Pro_API_35',
      },
    },
  },
  configurations: {
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
    'android.emu.debug.win': {
      device: 'emulator',
      app: 'android.debug.win',
    },
  },
};

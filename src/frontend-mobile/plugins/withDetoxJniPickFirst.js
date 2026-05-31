const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * Detox builds an extra `androidTest` APK that merges native libs from both
 * React Native core and libraries like react-native-gesture-handler. Several of
 * them ship `libfbjni.so` / `libc++_shared.so`, which makes the merge task fail
 * with "2 files found with path 'lib/.../libfbjni.so'".
 *
 * AGP 8.x only resolves this for native libs via `packaging.jniLibs.pickFirsts`
 * (the flat `packagingOptions.pickFirsts` that expo-build-properties writes
 * applies to *resources*, not `.so` files). This plugin injects the jniLibs
 * pickFirsts into the generated android/app/build.gradle so the fix survives
 * `expo prebuild`.
 */
const PICK_FIRST_LINE =
  "pickFirsts += ['**/libfbjni.so', '**/libc++_shared.so']";

module.exports = function withDetoxJniPickFirst(config) {
  return withAppBuildGradle(config, (cfg) => {
    if (cfg.modResults.language !== 'groovy') {
      throw new Error(
        'withDetoxJniPickFirst: expected a groovy build.gradle, got ' +
          cfg.modResults.language
      );
    }

    let contents = cfg.modResults.contents;

    // Idempotent: don't add it twice on repeated prebuilds.
    if (contents.includes(PICK_FIRST_LINE)) {
      return cfg;
    }

    // Insert into the existing `jniLibs {` block under packagingOptions.
    if (!contents.includes('jniLibs {')) {
      throw new Error(
        'withDetoxJniPickFirst: could not find a `jniLibs {` block in build.gradle'
      );
    }

    contents = contents.replace(
      'jniLibs {',
      `jniLibs {\n            ${PICK_FIRST_LINE}`
    );

    cfg.modResults.contents = contents;
    return cfg;
  });
};
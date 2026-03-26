# 📋 RideBuddy Android APK Build - Complete Commands Reference

## 🎯 Project Status: ✅ COMPLETE

**APK Ready:** `/Users/sujalgiri/RideBuddy2.0/client/android/app/build/outputs/apk/debug/app-debug.apk` (4.0 MB)

---

## 📁 File Locations

```
RideBuddy2.0/
├── APK_QUICK_START.md                          ← Quick 60-second setup
├── ANDROID_APK_DEPLOYMENT.md                   ← Complete deployment guide
├── ANDROID_BUILD_SUMMARY.md                    ← Technical summary & changes
├── client/
│   ├── .env                                    ← UPDATED: Production API URL
│   ├── capacitor.config.ts                     ← UPDATED: Java 17 config
│   ├── android/
│   │   ├── gradle.properties                   ← UPDATED: Java home path
│   │   ├── variables.gradle                    ← UPDATED: Java compatibility
│   │   ├── app/
│   │   │   ├── build.gradle                    ← UPDATED: Compile options
│   │   │   ├── capacitor.build.gradle          ← UPDATED: Java 17
│   │   │   └── build/outputs/apk/debug/
│   │   │       └── app-debug.apk               ← ✅ FINAL APK (4.0 MB)
│   │   └── capacitor-cordova-android-plugins/
│   │       └── build.gradle                    ← UPDATED: Java 17
│   └── node_modules/@capacitor/android/
│       └── capacitor/build.gradle              ← PATCHED: Java 17
└── server/                                     ← Backend on Railway
```

---

## 🚀 Installation Commands

### Quick Install (60 seconds)
```bash
# 1. Enable USB Debugging on device
#    Settings → About Phone → Build Number (7 taps) 
#    → Developer Options → USB Debugging ON

# 2. Verify device connected
adb devices
# Output: <device-id>    device

# 3. Install APK
adb install -r /Users/sujalgiri/RideBuddy2.0/client/android/app/build/outputs/apk/debug/app-debug.apk

# 4. Launch
adb shell am start -n com.ridebuddy.app/.MainActivity
```

### Full Path Installation
```bash
cd /Users/sujalgiri/RideBuddy2.0/client/android/app/build/outputs/apk/debug
adb install -r app-debug.apk
```

### Uninstall & Reinstall
```bash
adb uninstall com.ridebuddy.app
adb install -r /Users/sujalgiri/RideBuddy2.0/client/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🔨 Build Commands (if rebuilding)

### Quick Rebuild
```bash
cd /Users/sujalgiri/RideBuddy2.0/client/android
./gradlew assembleDebug
```

### Full Clean Rebuild
```bash
cd /Users/sujalgiri/RideBuddy2.0/client/android
./gradlew clean assembleDebug
```

### Rebuild After .env Changes
```bash
cd /Users/sujalgiri/RideBuddy2.0/client

# 1. Rebuild frontend
npm run build

# 2. Sync to Android
npx cap sync android

# 3. Build APK
cd android
./gradlew clean assembleDebug

# 4. Verify output
ls -lh app/build/outputs/apk/debug/app-debug.apk
```

### Build with Specific Options
```bash
cd /Users/sujalgiri/RideBuddy2.0/client/android

# Build with logging
./gradlew assembleDebug --info

# Build with full stacktrace
./gradlew assembleDebug --stacktrace

# Build specific variant
./gradlew assembleDebug --project-dir=app
```

---

## 🧪 Testing Commands

### Launch App
```bash
adb shell am start -n com.ridebuddy.app/.MainActivity
```

### View Logs
```bash
# All logs
adb logcat

# Filter by app
adb logcat | grep ridebuddy

# Filter errors only
adb logcat *:E

# Clear logs and show new ones
adb logcat -c && adb logcat
```

### Test API from Device
```bash
adb shell

# Inside shell, test API
curl -v https://ridebuddy-production-f5f2.up.railway.app/api/health

# Exit shell
exit
```

### Check Device Storage
```bash
adb shell
cd /data/data/com.ridebuddy.app
ls -la
exit
```

---

## 🔍 ADB Troubleshooting Commands

### Check Connected Devices
```bash
adb devices

# Verbose output
adb devices -l
```

### Reset ADB Connection
```bash
adb kill-server
adb start-server
adb devices
```

### Fix "Device Unauthorized"
```bash
# 1. Disconnect USB
# 2. Check device for "Allow this computer" prompt and approve
# 3. Reconnect USB
# 4. Check again
adb devices
```

### Check Java Installation
```bash
java -version
javac -version

# Find Java home
/usr/libexec/java_home -v 17

# Verify Gradle Java config
cd /Users/sujalgiri/RideBuddy2.0/client/android
./gradlew --version
```

---

## 📋 Development Environment Setup (if needed)

### Install Java 17 (macOS)
```bash
brew install openjdk@17

# Link to system PATH
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk

# Verify
java -version
```

### Install Android SDK
```bash
brew install --cask android-sdk

# Set environment variables
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$ANDROID_HOME/platform-tools:$PATH

# Verify
adb version
```

### Install Node.js & npm
```bash
brew install node

# Verify
node --version
npm --version
```

---

## 📊 Configuration Verification Commands

### Verify APK Contents
```bash
unzip -l /Users/sujalgiri/RideBuddy2.0/client/android/app/build/outputs/apk/debug/app-debug.apk | head -30
```

### Check APK Info
```bash
file /Users/sujalgiri/RideBuddy2.0/client/android/app/build/outputs/apk/debug/app-debug.apk
ls -lh /Users/sujalgiri/RideBuddy2.0/client/android/app/build/outputs/apk/debug/app-debug.apk
```

### Verify Android Manifest
```bash
cd /Users/sujalgiri/RideBuddy2.0/client/android
unzip -p app/build/outputs/apk/debug/app-debug.apk AndroidManifest.xml | strings | grep -i "permission\|internet"
```

### Check Capacitor Config in APK
```bash
cd /Users/sujalgiri/RideBuddy2.0/client/android
unzip -p app/build/outputs/apk/debug/app-debug.apk assets/capacitor.config.json
```

### Verify API URL in Environment
```bash
cat /Users/sujalgiri/RideBuddy2.0/client/.env
echo "---"
cat /Users/sujalgiri/RideBuddy2.0/client/.env.example
```

---

## 🧹 Cleanup Commands

### Remove APK from Device
```bash
adb uninstall com.ridebuddy.app
```

### Clean Gradle Cache
```bash
cd /Users/sujalgiri/RideBuddy2.0/client/android
./gradlew clean
```

### Remove Build Directory
```bash
rm -rf /Users/sujalgiri/RideBuddy2.0/client/android/app/build
```

### Clear Global Gradle Cache (last resort)
```bash
rm -rf ~/.gradle/caches
```

---

## 📈 Production Deployment Commands

### Build Release APK (requires signing key)
```bash
cd /Users/sujalgiri/RideBuddy2.0/client/android

# Create signing key (one-time)
# keytool -genkey -v -keystore release.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias ridebuddy

# Build release APK
./gradlew assembleRelease

# Output: app/build/outputs/apk/release/app-release.apk
```

### Sign Release APK (if using manual signing)
```bash
jarsigner -verbose \
  -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore release.keystore \
  app-release-unsigned.apk \
  ridebuddy
```

### Check APK Signature
```bash
jarsigner -verify -verbose app-release.apk
```

---

## 🎯 Deployment Workflow

```bash
# 1. Update .env with production API
nano /Users/sujalgiri/RideBuddy2.0/client/.env
# Change: VITE_NATIVE_API_URL=https://your-production-api.com/api

# 2. Build frontend
cd /Users/sujalgiri/RideBuddy2.0/client
npm run build

# 3. Sync Capacitor
npx cap sync android

# 4. Build APK
cd android
./gradlew clean assembleDebug

# 5. Verify APK
ls -lh app/build/outputs/apk/debug/app-debug.apk

# 6. Install on device
adb install -r app/build/outputs/apk/debug/app-debug.apk

# 7. Test on device
adb shell am start -n com.ridebuddy.app/.MainActivity

# 8. View logs
adb logcat | grep ridebuddy
```

---

## 🔐 Security Commands

### Check App Permissions
```bash
adb shell pm list permissions -g | grep -i ridebuddy
```

### Grant Permissions to App
```bash
adb shell pm grant com.ridebuddy.app android.permission.INTERNET
adb shell pm grant com.ridebuddy.app android.permission.ACCESS_NETWORK_STATE
```

### View App Package Information
```bash
adb shell pm dump com.ridebuddy.app | grep -A 5 "version\|permission"
```

---

## 💾 Backup & Restore Commands

### Backup App Data
```bash
adb backup -f /Users/sujalgiri/backup.ab com.ridebuddy.app
```

### Restore App Data
```bash
adb restore /Users/sujalgiri/backup.ab
```

### Extract APK from Device
```bash
adb pull /data/app/com.ridebuddy.app-*/base.apk ~/ridebuddy-device.apk
```

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| **Install APK** | `adb install -r app-debug.apk` |
| **Launch App** | `adb shell am start -n com.ridebuddy.app/.MainActivity` |
| **View Logs** | `adb logcat \| grep ridebuddy` |
| **Rebuild APK** | `cd android && ./gradlew assembleDebug` |
| **Uninstall App** | `adb uninstall com.ridebuddy.app` |
| **Check Devices** | `adb devices` |
| **Reset ADB** | `adb kill-server && adb start-server` |
| **View APK Contents** | `unzip -l app-debug.apk` |
| **Check Java Version** | `java -version` |
| **Rebuild Everything** | `npm run build && npx cap sync android && ./gradlew clean assembleDebug` |

---

## 📚 Documentation Files

- **APK_QUICK_START.md** - 60-second setup guide
- **ANDROID_APK_DEPLOYMENT.md** - Complete deployment and troubleshooting
- **ANDROID_BUILD_SUMMARY.md** - Technical details and changes
- **This File** - All commands reference

---

**Last Updated:** March 26, 2025  
**Status:** ✅ Complete & Ready for Deployment

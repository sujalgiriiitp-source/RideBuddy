# 🚀 RideBuddy APK - Quick Start Guide

## 📍 APK Location
```
/Users/sujalgiri/RideBuddy2.0/client/android/app/build/outputs/apk/debug/app-debug.apk
```

**Size:** 4.0 MB | **Package:** com.ridebuddy.app | **Version:** 1.0

---

## ⚡ 60-Second Installation

### 1. Connect Device & Enable USB Debugging
```bash
# On Android device:
# Settings → About Phone → Build Number (tap 7 times) 
# → Developer Options → USB Debugging ON

# On computer:
adb devices  # Device should appear as "device" not "unauthorized"
```

### 2. Install APK
```bash
adb install -r /Users/sujalgiri/RideBuddy2.0/client/android/app/build/outputs/apk/debug/app-debug.apk
```

### 3. Launch & Test
- Device launcher → Search "RideBuddy" → Tap to open
- Or: `adb shell am start -n com.ridebuddy.app/.MainActivity`

---

## ✅ What Works

- ✅ **Signup/Login** - Create account and authenticate
- ✅ **View Rides** - List of available rides from Railway backend
- ✅ **Create Ride** - Offer a ride to other users
- ✅ **Join Ride** - Accept ride offers from other users
- ✅ **WhatsApp Integration** - One-click message driver
- ✅ **User Profile** - View profile and logout
- ✅ **Real API** - All calls use Railway production backend
- ✅ **No Localhost** - Uses HTTPS public endpoint

---

## 🔧 Configuration

| Setting | Value |
|---------|-------|
| **Backend API** | https://ridebuddy-production-f5f2.up.railway.app/api |
| **App ID** | com.ridebuddy.app |
| **Min Android** | 6.0 (API 23) |
| **Target Android** | Android 15 (API 35) |

---

## 🐛 Troubleshooting

**APK Won't Install:**
```bash
# Ensure ADB is in PATH
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$ANDROID_HOME/platform-tools:$PATH

# Try again
adb install -r app-debug.apk
```

**Device Not Found:**
```bash
# Reset ADB connection
adb kill-server
adb start-server
adb devices  # Should show device now
```

**App Shows Blank Screen:**
- Check device internet (open browser on device)
- Ensure API is reachable: `curl https://ridebuddy-production-f5f2.up.railway.app/api/health`
- Check device logs: `adb logcat | grep -i ridebuddy`

**Rates Limited / API Errors:**
- Check Railway backend status
- Verify `.env` has correct VITE_NATIVE_API_URL
- Rebuild APK if .env changed:
  ```bash
  cd /Users/sujalgiri/RideBuddy2.0/client
  npm run build
  npx cap sync android
  cd android && ./gradlew assembleDebug
  ```

---

## 📊 Test Checklist

- [ ] Install APK on device
- [ ] Signup with new email
- [ ] Verify rides load on Home page
- [ ] Create a test ride
- [ ] Join an existing ride
- [ ] Tap WhatsApp to verify number link
- [ ] Go to Profile and verify user data
- [ ] Logout and login again
- [ ] Test on multiple apps (WiFi + Cellular if possible)

---

## 📦 Build Info

**Built:** March 26, 2025

**Files Changed:** 8
- client/.env
- client/capacitor.config.ts
- client/android/gradle.properties
- client/android/variables.gradle
- client/android/app/build.gradle
- client/android/app/capacitor.build.gradle
- client/android/capacitor-cordova-android-plugins/build.gradle
- client/node_modules/@capacitor/android/capacitor/build.gradle

**Build Logs:** `BUILD SUCCESSFUL in 2s`

---

## 🎯 Next Steps

1. ✅ Install on device using above steps
2. ✅ Test all user flows
3. ✅ Verify API connectivity works on device network
4. ❓ For production: build release APK with signing key
5. ❓ Upload to Google Play Store (requires developer account)

---

## 📚 Detailed Guides

- **Full Setup:** See `ANDROID_APK_DEPLOYMENT.md`
- **Build Details:** See `ANDROID_BUILD_SUMMARY.md`
- **API Reference:** Check server README

---

**Status:** ✅ Ready to Deploy | **Last Updated:** Mar 26, 2025

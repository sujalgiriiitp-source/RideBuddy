# RideBuddy Android APK Deployment Guide

## ✅ Build Complete

**APK Location:** `/Users/sujalgiri/RideBuddy2.0/client/android/app/build/outputs/apk/debug/app-debug.apk`

**APK Size:** ~4.0 MB

**Package Name:** `com.ridebuddy.app`

**API Configuration:** `https://ridebuddy-production-f5f2.up.railway.app/api`

---

## 📋 Configuration Summary

### Environment Files Updated
- ✅ `client/.env` → Set `VITE_NATIVE_API_URL=https://ridebuddy-production-f5f2.up.railway.app/api`
- ✅ `client/capacitor.config.ts` → Added Android build options (Java 17)
- ✅ `android/gradle.properties` → Set Java home path and JVM args
- ✅ `android/app/capacitor.build.gradle` → Downgraded to Java 17
- ✅ `android/variables.gradle` → Added Java compatibility settings
- ✅ `android/app/build.gradle` → Added compile options (Java 17)

### Build Tools Configured
- **Java Version:** 17 (OpenJDK from Homebrew)
- **Build Gradle:** 8.7.2
- **Android SDK:** compileSdk 35, minSdk 23, targetSdk 35
- **Capacitor Android:** Version 7.6.1
- **Architecture:** ARM64, ARMv7 (included in build)

### Permissions
- ✅ `INTERNET` permission enabled in `AndroidManifest.xml`
- ✅ No other special permissions needed for basic ride sharing

---

## 🚀 Installation on Android Device

### Prerequisites
1. **USB Cable:** Connect your Android device with a USB cable
2. **USB Debugging:** Enable on your device (required for ADB)
3. **ADB Path:** Ensure Android SDK platform-tools are in PATH

### Step 1: Enable USB Debugging on Device

**For Android 12 and above:**
1. Open Settings → About Phone
2. Tap "Build Number" 7 times
3. Go back to Settings → Developer options
4. Enable "USB Debugging"
5. Allow USB debugging access when prompted

**For Android 11 and below:**
1. Open Settings → Developer options
2. Enable "USB Debugging"

### Step 2: Verify ADB Connection

```bash
# Check connected devices
adb devices

# Output should show:
# List of attached devices
# <device-id>    device
```

If device shows "unauthorized":
- Disconnect USB cable
- Check "Always allow from this computer" on device prompt
- Reconnect USB cable

### Step 3: Install APK

```bash
# Navigate to APK location
cd /Users/sujalgiri/RideBuddy2.0/client/android/app/build/outputs/apk/debug

# Install APK on connected device
adb install -r app-debug.apk

# Output should show:
# Success
```

**Flags:**
- `-r`: Reinstall if already present
- `-g`: Grant all permissions automatically

To grant permissions automatically:
```bash
adb install -r -g app-debug.apk
```

---

## 🧪 Testing on Device

### Launch the App

**Option 1: From Device UI**
- Open device launcher
- Search for "RideBuddy"
- Tap to launch

**Option 2: From ADB**
```bash
adb shell am start -n com.ridebuddy.app/.MainActivity
```

### Test API Connectivity

Once app is open:

1. **Navigate to Auth Page**
   - If logged out, you should see Login/Signup forms

2. **Test Signup (Create Account)**
   - Enter email: `test@ridebuddy.com`
   - Enter password: `Test@123`
   - Enter phone: `+1234567890`
   - Tap "Sign Up"
   - ✅ Should show success toast and redirect to Home

3. **Test Home Page**
   - Should see available rides
   - If loading spinner appears and doesn't resolve, check API connectivity

4. **Test API Error Handling**
   - If rides don't load:
     - Open Chrome DevTools on computer (if remote debugging enabled)
     - Or check Railway backend logs for errors
     - Ensure `VITE_NATIVE_API_URL` is correct in `.env`

### Verify API Endpoint

```bash
# Test API from device's adb shell
adb shell

# Inside shell:
curl -v https://ridebuddy-production-f5f2.up.railway.app/api/rides

# Should return 200 with rides array (or empty array)
```

### Check Logs

```bash
# View app logs
adb logcat | grep -i ridebuddy

# View all errors
adb logcat *:E | grep -i "ride\|api\|network"
```

---

## 🔍 Troubleshooting

### Issue 1: APK Won't Install
**Error:** `adb: command not found`

**Solution:**
```bash
# Set Android SDK path
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$ANDROID_HOME/platform-tools:$PATH

# Verify ADB is found
which adb  # Should show path

# Try install again
adb install -r app-debug.apk
```

### Issue 2: Device Not Detected
**Error:** `error: device not found` or list is empty

**Solution:**
1. Disconnect USB cable
2. Check device for authorization prompt and allow
3. Try USB port on computer (some ports have issues)
4. Verify USB Debugging is ON in device settings
5. Reconnect USB cable

```bash
adb kill-server
adb start-server
adb devices
```

### Issue 3: App Shows Blank Screen or Loading Spinner
**Error:** Rides not loading, blank white screen

**Solutions:**
1. **Check API URL:**
   - Ensure `client/.env` has: `VITE_NATIVE_API_URL=https://ridebuddy-production-f5f2.up.railway.app/api`
   - Ensure it's `https` (not `http`)
   - No `localhost` or `127.0.0.1`

2. **Verify Railway Backend is Running:**
   ```bash
   curl https://ridebuddy-production-f5f2.up.railway.app/api/health
   # Should return: {"status":"ok"}
   ```

3. **Check Device Internet:**
   - Device must be on same network (WiFi or cellular)
   - Open browser on device, navigate to `https://ridebuddy-production-f5f2.up.railway.app`
   - Should load without errors

4. **Rebuild APK if .env changed:**
   ```bash
   cd /Users/sujalgiri/RideBuddy2.0/client
   npm run build
   npx cap sync android
   cd android && ./gradlew clean assembleDebug
   adb install -r app/build/outputs/apk/debug/app-debug.apk
   ```

### Issue 4: "CORS Error" or 403 Response
**Error:** Browser console shows CORS error, API returns 403

**Solution:**
- Check Railway backend `CLIENT_URL` env var
- Ensure it includes your frontend domain (not needed for native apps)
- For testing, add `*` temporarily (not recommended for production)

```bash
# On Railway backend, set:
CLIENT_URL=*

# Or specific domain:
CLIENT_URL=https://your-vercel-domain.com
```

### Issue 5: JWT Token Errors
**Error:** `401 Unauthorized` on profile/create ride

**Solution:**
1. Log out (clear token)
2. Log in again with correct email/password
3. Token should be saved to localStorage

```bash
# Check stored token (if app has debug logging)
adb shell
cd /data/data/com.ridebuddy.app
ls -la
```

---

## 📦 Uninstall & Clean Up

### Remove App from Device
```bash
adb uninstall com.ridebuddy.app
```

### Clean Local Build
```bash
cd /Users/sujalgiri/RideBuddy2.0/client/android
./gradlew clean
```

### Reset Gradle Cache (if build issues persist)
```bash
rm -rf ~/.gradle/caches
./gradlew clean assembleDebug
```

---

## 🎯 Common Testing Scenarios

### Scenario 1: Login & View Rides
1. Uninstall old app: `adb uninstall com.ridebuddy.app`
2. Install new APK: `adb install -r app-debug.apk`
3. Launch: `adb shell am start -n com.ridebuddy.app/.MainActivity`
4. Tap "Login"
5. Enter email & password
6. Should see Home page with rides
7. Scroll down to load more rides
8. Tap on a ride to see details

### Scenario 2: Create Ride
1. After login, go to "Offer Ride" tab
2. Fill form:
   - From: "New York"
   - To: "Boston"
   - Date: Today or tomorrow
   - Time: Current or future time
   - Vehicle: "Car"
   - Seats: 3
3. Tap "Create Ride"
4. Should redirect to Home and see new ride at top

### Scenario 3: Join Ride (Test WhatsApp)
1. Go to "Find Rides" tab
2. Find a ride with available seats
3. Tap "Join Ride" button on ride card
4. Should accept and show "Joined" state
5. Tap WhatsApp icon to test WhatsApp link
6. Should open WhatsApp with pre-filled number

### Scenario 4: Profile
1. Go to "Profile" tab
2. See your email and phone
3. Tap "Logout"
4. Should redirect to Auth page

---

## 🔐 Security Notes

### API Configuration
- ✅ Uses HTTPS (not HTTP)
- ✅ No hardcoded localhost
- ✅ JWT tokens stored in localStorage
- ✅ CORS enabled on Railway backend

### Production Considerations
1. Change app signing key for production release
2. Build release APK instead of debug APK
3. Obfuscate code with R8/ProGuard
4. Test on multiple Android versions (API 23+)

---

## 📊 Build Metadata

**Generated:** March 26, 2025

**Android Configuration:**
- **Min SDK:** 23 (Android 6.0)
- **Target SDK:** 35 (Android 15)
- **Compile SDK:** 35
- **Java Target:** 17
- **Build Tools:** 8.7.2

**Dependencies:**
- AndroidX Activity 1.9.2
- AndroidX Core 1.15.0
- AndroidX AppCompat 1.7.0
- AndroidX Fragment 1.8.4
- AndroidX WebKit 1.12.1
- Capacitor Android 7.6.1
- Cordova Android 10.1.1

**Architecture Support:**
- ARM64 (64-bit) - Primary
- ARMv7 (32-bit) - Included for compatibility

---

## ✨ Next Steps

1. ✅ Install APK on device using above instructions
2. ✅ Test all flows (signup, login, view rides, create ride, join ride)
3. ✅ Verify API connectivity works on device
4. ❓ If issues occur, refer to Troubleshooting section
5. ❓ For production, generate release APK with signing key
6. ❓ Consider app store submission (Google Play Store)

---

## 📞 Support

For issues:
1. Check Troubleshooting section above
2. Verify Railway backend logs: https://railway.app
3. Check `adb logcat` for app errors
4. Ensure device internet is working (test with browser)

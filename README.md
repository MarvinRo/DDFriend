# D&D MOBILE CHARACTER SHEET

This application is a personal project created to manage Dungeons & Dragons character sheets, facilitating gameplay among friends.

---

## 🚀 Getting Started

Follow the steps below to set up the development environment and run the application on your device or emulator.

### 1. Installation

Install all required Node.js dependencies:

npm install
# OR
npm i

<!-- ### 2. Native Dependencies Setup (iOS)

If you plan to run the app on iOS, you must install the native dependencies using **CocoaPods**:

# Navigate to the iOS folder
cd ios

# Install the native dependencies
pod install

# Go back to the project root
cd .. -->

### 3. Firebase Configuration and Credentials (REQUIRED)

For the app to connect to Google/Firebase services, you must provide the configuration files and access keys from your Firebase console.

#### A. Service Configuration Files (JSON / Plist)

These files must be downloaded directly from the Firebase console and placed in the specific platform folders:

| Platform | Required File | Location |
| :--- | :--- | :--- |
| **Android** | `google-services.json` | `android/app/` |
<!-- | **iOS** | `GoogleService-Info.plist` | `ios/` | -->

#### B. Environment Variables (.env)

Create a file named **`.env`** in the **root of the project folder** to store external access keys.

**Example of .env:**

# This key is typically required for Google Sign-In via Firebase

GOOGLE_WEB_CLIENT_ID="YOUR_FIREBASE_WEB_CLIENT_ACCESS_KEY"
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=STORE_PASSWORD
MYAPP_RELEASE_KEY_PASSWORD=KEY_PASSWORD

*(Replace "YOUR_FIREBASE_WEB_CLIENT_ACCESS_KEY" with your actual Firebase credential.)*

---

## ▶️ Running the Application

Ensure you have a configured Android or iOS emulator running, or a physical device connected with USB Debugbing enabled.

# To start the application on Android
npm run start

# In another terminal run the command
npm run android
<!-- 
# To start the application on iOS
npm run ios -->

**Tip:** If you encounter environment errors, run `npx react-native doctor` to diagnose issues with your setup.
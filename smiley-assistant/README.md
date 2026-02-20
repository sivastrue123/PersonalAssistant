# Smiley’s Assistant ❤️

A romantic wellness application built with React, Capacitor, and Supabase.

## Features
- **Home Mode**: Toggle to silence romantic notifications when you are home.
- **Heart Dashboard**: Animated beating heart with rotating motivational messages.
- **Chat**: Realtime chat with your partner.
- **Wellness**: Water tracker, Breathing exercises, and Chemistry jokes.
- **Notes & Dates**: Shared notes and important dates calendar.

## Prerequisites
- Node.js (v18+)
- Android Studio (for building the APK)
- A Supabase project

## Setup Instructions

1.  **Install Dependencies**
    ```bash
    npm install
    ```

2.  **Supabase Setup**
    - Create a new project on [Supabase](https://supabase.com).
    - Go to the **SQL Editor** in your Supabase dashboard.
    - Copy the contents of `supabase/schema.sql` and run it. This will create the tables and policies.
    - Go to **Project Settings > API**. Copy the `Project URL` and `anon` public key.

3.  **Environment Variables**
    - Rename `.env.example` to `.env`.
    - Paste your Supabase URL and Anon Key:
      ```
      VITE_SUPABASE_URL=your_project_url
      VITE_SUPABASE_ANON_KEY=your_anon_key
      ```

4.  **Run Web Version**
    ```bash
    npm run dev
    ```

## Building for Android (APK)

1.  **Build the Web Assets**
    ```bash
    npm run build
    ```
    This creates the `dist` folder.

2.  **Sync with Capacitor**
    ```bash
    npx cap sync
    ```
    This copies the `dist` folder to the native Android project.

3.  **Open in Android Studio**
    ```bash
    npx cap open android
    ```
    Or open the `android` folder manually in Android Studio.

4.  **Run/Build APK**
    - In Android Studio, wait for Gradle sync to finish.
    - Connect your device or start an emulator.
    - Click the **Run** (Play) button.
    - To build an APK: `Build > Build Bundle(s) / APK(s) > Build APK(s)`.

## Troubleshooting

- **Supabase Connection**: Ensure your `.env` file is correct and you have applied the schema.
- **White Screen on Android**: Ensure `npm run build` was successful before syncing.
- **Icons Missing**: Ensure `lucide-react` is installed.

## Project Structure

- `src/components`: Reusable UI components (WaterTracker, BreathingExercise, etc.)
- `src/contexts`: Global state (AuthContext)
- `src/pages`: Main screens (Home, Chat, Notes, Dates)
- `src/hooks`: Custom hooks (usePartner)
- `src/supabase.ts`: Supabase client configuration
- `supabase/schema.sql`: Database definitions

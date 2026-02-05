# OWC Client

Cross-platform mobile application for tracking Overwatch player statistics. Built with React Native and Expo.

## Tech Stack

- **React Native** 0.81.5 with **Expo** 54
- **TypeScript** 5.9
- **React Query** for server state management
- **Expo Router** for file-based navigation
- **Expo Secure Store** for credential storage

## Prerequisites

- Node.js 18+
- pnpm 10+
- Expo CLI
- iOS Simulator (macOS) or Android Emulator
- Expo Go app (for real device testing)

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your API URLs:

```bash
# Override for any platform (takes precedence)
EXPO_PUBLIC_API_URL=

# Production
EXPO_PUBLIC_API_URL_PRODUCTION=https://api.yoursite.com

# Development - platform specific
EXPO_PUBLIC_API_URL_DEV_WEB=http://localhost:8000
EXPO_PUBLIC_API_URL_DEV_ANDROID_EMULATOR=http://10.0.2.2:8000
EXPO_PUBLIC_API_URL_DEV_ANDROID_DEVICE=http://YOUR_LOCAL_IP:8000
EXPO_PUBLIC_API_URL_DEV_IOS_SIMULATOR=http://localhost:8000
```

### 3. Start Development Server

```bash
pnpm start
```

### 4. Run on Device/Emulator

```bash
# iOS Simulator
pnpm ios

# Android Emulator
pnpm android

# Web Browser
pnpm web
```

## Running on a Real Device

Testing on a physical phone requires additional setup because `localhost` on your phone refers to the phone itself, not your development machine.

### Requirements

1. Your phone and computer must be on the **same Wi-Fi network**
2. Install **Expo Go** from the App Store or Play Store
3. The API server must be accessible from your network

### Setup Steps

#### 1. Find Your Computer's Local IP

```bash
# macOS
ipconfig getifaddr en0

# Linux
hostname -I | awk '{print $1}'

# Windows
ipconfig
# Look for "IPv4 Address" under your Wi-Fi adapter
```

Example output: `192.168.0.132`

#### 2. Configure the Client

Edit `.env.local` and set your IP:

```bash
EXPO_PUBLIC_API_URL_DEV_ANDROID_DEVICE=http://192.168.0.132:8000
```

Or use the override to apply to all platforms:

```bash
EXPO_PUBLIC_API_URL=http://192.168.0.132:8000
```

#### 3. Start the API Server on All Interfaces

The API must listen on `0.0.0.0` (all network interfaces), not just `localhost`:

```bash
# In the owc-api directory
composer dev:device
```

This runs `php artisan serve --host=0.0.0.0` which makes the API accessible from other devices on your network.

#### 4. Start the Expo Dev Server

```bash
pnpm start
```

#### 5. Connect Your Phone

1. Open **Expo Go** on your phone
2. Scan the QR code shown in the terminal
3. The app will load on your device

### Troubleshooting Real Device Issues

| Problem | Solution |
|---------|----------|
| Can't connect to API | Verify phone and computer are on same Wi-Fi |
| Connection refused | Ensure API is running with `--host=0.0.0.0` |
| QR code won't scan | Try switching between "Tunnel" and "LAN" in Expo |
| Slow loading | Use LAN mode instead of Tunnel for faster speeds |

## Project Structure

```
owc-client/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Auth screens (sign-in)
│   ├── (tabs)/            # Main app tabs
│   └── _layout.tsx        # Root layout with providers
├── components/            # Reusable UI components
├── contexts/              # React Context providers
│   ├── AuthContext.tsx    # Authentication state
│   └── ThemeContext.tsx   # Theme state
├── hooks/                 # Custom React hooks
├── lib/                   # Services and utilities
│   ├── api.ts            # API client
│   ├── auth.ts           # Auth service
│   └── storage.ts        # Secure storage
├── types/                 # TypeScript definitions
├── constants/             # App constants (theme)
└── __tests__/            # Test files
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm start` | Start Expo development server |
| `pnpm ios` | Run on iOS simulator |
| `pnpm android` | Run on Android emulator |
| `pnpm web` | Run in web browser |
| `pnpm lint` | Run ESLint and TypeScript check |
| `pnpm lint:fix` | Auto-fix ESLint issues |
| `pnpm format` | Format code with Prettier |
| `pnpm test` | Run tests |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:coverage` | Generate coverage report |

## Code Quality

This project enforces strict code quality with custom ESLint rules:

- **FC Pattern**: Components must use `FC<Props>` typing
- **Types Location**: Types must be in `types/` folder
- **Styling Rules**: No hardcoded colors, use StyleSheet.create
- **Folder Structure**: Components in `ComponentName/ComponentName.tsx`
- **Error Handling**: All promises must have catch handlers

Run all checks:

```bash
pnpm lint
```

## Testing

Tests use Jest with React Native Testing Library:

```bash
# Run all tests
pnpm test

# Run with coverage
pnpm test:coverage
```

Coverage thresholds: 70% for branches, functions, lines, and statements.

## Building for Production

### EAS Build

```bash
# Development build (internal testing)
pnpm build:dev:android

# Preview build (APK for testing)
pnpm build:preview:android

# Production build
pnpm build:prod:android
```

## Authentication Flow

1. User taps "Sign in with Battle.net"
2. App opens OAuth flow via `expo-web-browser`
3. User authenticates on Battle.net
4. Callback redirects to `owc://auth/callback?token=...`
5. App stores token securely and navigates to home

## Deep Linking

The app handles the `owc://` scheme:

- `owc://auth/callback` - OAuth callback

## Environment Variables

| Variable | Description |
|----------|-------------|
| `EXPO_PUBLIC_API_URL` | Override API URL for all platforms |
| `EXPO_PUBLIC_API_URL_PRODUCTION` | Production API URL |
| `EXPO_PUBLIC_API_URL_DEV_WEB` | Development URL for web |
| `EXPO_PUBLIC_API_URL_DEV_ANDROID_EMULATOR` | Development URL for Android emulator |
| `EXPO_PUBLIC_API_URL_DEV_ANDROID_DEVICE` | Development URL for Android device |
| `EXPO_PUBLIC_API_URL_DEV_IOS_SIMULATOR` | Development URL for iOS simulator |

## License

Private - All rights reserved

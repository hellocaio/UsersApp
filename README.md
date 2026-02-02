# UsersApp

A simple React Native app built with Expo that displays a list of users from an API.

## Features

- Fetches user data from a REST API
- Displays users in a scrollable list with pull-to-refresh
- Shows user details on tap
- Clean, responsive UI with TypeScript

## Tech Stack

- **Expo** - React Native framework for faster development
- **TypeScript** - Type safety and better developer experience
- **React Navigation** - Navigation between screens

## Project Structure

```
src/
├── api/
│   └── users.ts          # API service for fetching users
├── components/
│   └── UserCard.tsx      # Reusable user card component
├── screens/
│   ├── UserListScreen.tsx    # Main user list view
│   └── UserDetailScreen.tsx  # User detail view
└── types/
    └── User.ts           # TypeScript interfaces
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo Go app on your mobile device (for testing on physical device)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd UsersApp
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - Or press `i` for iOS simulator / `a` for Android emulator

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android emulator
- `npm run ios` - Run on iOS simulator
- `npm run web` - Run in web browser

## API

The app consumes the Mockaroo Users API which returns paginated user data with the following structure:

```json
{
  "total": 1000,
  "page": 1,
  "count": 50,
  "numPages": 20,
  "entries": [
    {
      "id": 1,
      "name": { "firstName": "John", "lastName": "Doe" },
      "email": "john.doe@example.com",
      "gender": "Male",
      "role": "Admin"
    }
  ]
}
```

## Architecture Decisions

- **Expo over bare React Native**: Chosen for faster setup and easier testing without native build configuration
- **Functional components with hooks**: Modern React patterns for cleaner, more readable code
- **Separate API layer**: Decouples data fetching from UI components for better maintainability
- **TypeScript interfaces**: Ensures type safety when working with API responses

## Future Improvements

- Add pagination support for loading more users
- Implement search/filter functionality
- Add offline caching
- Unit tests for components and API service

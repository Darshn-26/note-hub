# NOTE-HUB

## Overview
NOTE-HUB is a real-time collaborative note-taking and document editing platform, built with modern web technologies. It allows multiple users to edit, update, and delete notes or documents in real time while integrating AI assistance for enhanced productivity.

## Features
- **Real-time collaboration** with live cursors and instant updates.
- **AI-powered assistance** for calculations, content generation, and structuring notes.
- **Granular access control**, allowing document owners to manage permissions.
- **Authentication & User Management** with Clerk.
- **Cloud storage & database** using Firebase and Firestore.
- **Interactive UI components** with ShadCN & Tailwind CSS.
- **Live editing & sync** powered by Liveblocks.
- **Dark mode support** for a seamless user experience.

## Tech Stack
- **Next.js** (App Router & Server Components)
- **ShadCN UI** (Tailwind CSS & Radix UI)
- **Clerk** (Authentication & User Management)
- **Firebase & Firestore** (Cloud Database & Storage)
- **Liveblocks** (Real-time Collaboration & Live Editing)
- **Google Gemini AI** (AI-powered assistance)
- **Framer Motion** (Animations)
- **React.js**

---

## Installation & Setup

### Step 1: Create a Next.js App
```sh
npx create-next-app@latest note-hub
```
Options:
- TypeScript: Yes
- ESLint: Yes
- Tailwind CSS: Yes
- App Router: Yes
- Turbopack: Yes
- Import Alias: No

### Step 2: Install ShadCN UI
ShadCN provides a collection of UI components built with Tailwind CSS.
```sh
npx shadcn@latest init
npx shadcn@latest add button
```

### Step 3: Install Clerk for Authentication
Clerk provides user authentication and session management.
```sh
npm install @clerk/nextjs
```

### Step 4: Setup Layout Components
- Create a **Header** component.
- Add **Sidebar** with router buttons including a "New Document" button.

### Step 5: Add UI Enhancements
```sh
npx shadcn@latest add drawer  # Drawer button
npx shadcn@latest add sheet   # Sidebar toggle for mobile screens
```

### Step 6: Setup Cloudflare (Pending)

### Step 7: Setup Firebase for Cloud Database
- Create a Firebase project.
- Register a web app in Firebase.
- Retrieve the SDK snippet and add it to `firebase.tsx`.
```sh
npm install firebase
```

### Step 8: Configure Firebase Admin SDK
- Download the private key from Firebase service accounts.
- Rename the JSON file to `service_key.json`.
- Create `firebase-admin.ts`.
```sh
npm install firebase-admin
```
- Import required modules in `firebase-admin.ts`.

### Step 9: Create Actions for Firebase Integration
- Create an `actions/` folder to handle add/delete operations in Firestore collections.

### Step 10: Define Types
- Create a `types/` folder with `types.tsx` to define user data types.

### Step 11: Extend Global Interface
- Create `globals.d.ts` for interface extensions.
- Fix middleware errors by moving it to `src/middleware.ts`.

### Step 12: Update Sidebar for Document Management
```sh
npm install --save react-firebase-hooks
```
- Modify `sidebar.tsx` to display real-time documents.
- Add Firestore indexes for `roomId` and `userId`.

### Step 13: Fix 404 Errors by Creating a Document Page
- Create a `doc/` folder.
- Inside `doc/`, create `[id]/` folder.
- Create `pages.tsx` for document routing.

### Step 14: Implement Document Input & Sync
- Update `document.tsx` to sync changes in real time.
- Add breadcrumbs navigation using `breadcrumbs.tsx`.

### Step 15: Integrate Liveblocks for Real-Time Editing
```sh
npm install @liveblocks/client @liveblocks/react @liveblocks/yjs yjs @blocknote/core @blocknote/react @blocknote/mantine
npx create-liveblocks-app@latest --init --framework react
```
- Retrieve Liveblocks API keys and store them in `.env.local`.
- Update `document.tsx` to enable live editing with multiple users.

### Step 16: Enhance Document Editing Features
- Add dark mode support to the editor (`editor.tsx`).
- Update `document.tsx` to allow inviting and removing users from a room.
- Display user avatars in `document.tsx`.
- Implement document sharing functionality.

### Step 17: Integrate GenAI for Smart Assistance
```sh
npm install @google/generative-ai
```
- Create a `genai.tsx` file to handle AI interactions.
- Implement AI-based note suggestions, text enhancements, and basic calculations.
- Create an API route:
  - `route.ts`: Handles GenAI requests and responses.
  - `chat.ts`: Manages AI-powered chat functionalities within documents.

## Conclusion
NOTE-HUB is designed to streamline real-time document collaboration with AI-powered assistance. It integrates authentication, cloud storage, and live editing seamlessly, making it a powerful alternative to traditional note-taking apps.

Feel free to contribute or provide feedback! 🚀


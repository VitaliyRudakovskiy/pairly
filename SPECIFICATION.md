# SPECIFICATION

## 1. GENERAL INFORMATION

### 1.1 Project Name

Project name: Autolog

### 1.2 Project Type

Web application (mobile-first) with responsive desktop support

### 1.3 Concept

The application is a lightweight, focused platform for interaction between two users. It is not a social network. The core idea is to provide a private, minimal, and structured space for:

- communication (1-to-1 chat)
- shared activities (planning, lists, notes — future scope)
- personal representation (profile)

The product is intentionally limited in scope to maintain simplicity and clarity of UX.

## 2. CORE IDEA

### 2.1 Problem Statement

Most existing platforms are:

- overloaded (social networks)
- impersonal (messengers without structure)
- not optimized for small private interactions

### 2.2 Solution

A minimal system focused on:

- one-to-one relationships
- structured interaction
- clean UI/UX
- fast iteration and extensibility

## 3. MVP SCOPE

### 3.1 Authentication

- Email + Password
- Google OAuth
- Firebase Authentication

### 3.2 User Profile

- Display user data from Firestore
- Inline editing
- Avatar upload and removal
- Persistent storage

### 3.3 Chat (planned)

- 1-to-1 only
- No groups
- Real-time updates

### 3.4 Navigation

Mobile-first navigation with sidebar (desktop) and bottom navigation (mobile)

## 4. APPLICATION STRUCTURE

### 4.1 Main Pages

#### 4.1.1 Auth Page

Purpose:

- Login / Registration

Features:

- Email/password form
- Google login
- Validation using Angular Signals Forms
- Error handling (mapped Firebase errors)

#### 4.1.2 Home Page

Purpose:

- Entry point after login

MVP:

- Placeholder / future dashboard

#### 4.1.3 Profile Page

Purpose:

- View and edit current user profile

Features:

- Avatar display (Cloudinary URL or fallback)
- Inline editing:
  - displayName
  - status
- Avatar upload
- Avatar removal (confirmation modal)

UX pattern:

- Inline editing (click-to-edit)
- Blur / Enter to save

#### 4.1.4 Friends Page (planned)

Purpose:

- Manage connections

MVP:

- List of users
- Add/remove friends

---

#### 4.1.5 Pair Page (planned)

Purpose:

- Represent relationship between two users

Features:

- Partner info
- Shared data (future)

#### 4.1.6 Chat Page (planned)

Purpose:

- Direct communication

Features:

- 1-to-1 messaging only
- Real-time updates

#### 4.1.7 Settings Page

Purpose:

- Application-level settings (future)

## 5. DATA MODEL

### 5.1 UserProfile (Firestore)

```ts
interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoUrl: string | null;
  status: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 5.2 Storage Strategy

- Firestore: structured data
- Cloudinary: images (avatars)
- Firebase Auth: identity

## 6. ARCHITECTURE

### 6.1 Core Principles

- Separation of concerns
- Signals-first approach
- Minimal RxJS usage
- Single source of truth

### 6.2 Services

#### 6.2.1 AuthService

Responsibilities:

- Firebase Authentication integration
- Maintain currentUser signal
- Maintain isAuthReady signal

Rules:

- Only service that listens to onAuthStateChanged

#### 6.2.2 UserService

Responsibilities:

- Manage Firestore user profile
- Expose currentUserProfile signal
- CRUD operations for user data

Behavior:

- Reacts to AuthService via signals
- Loads profile on auth change

#### 6.2.3 CloudinaryService

Responsibilities:

- Upload images and avatars
- Return secure url

#### 6.2.4 NotificationService

Responsibilities:

- UI notifications
- error/success/info/warning handling

#### 6.2.5 LoggerService

Responsibilities:

- Centralized logging

## 7. STATE MANAGEMENT

### 7.1 Approach

- Angular Signals as primary state mechanism
- No NgRx in MVP
- Local service-based state

### 7.2 Patterns

- signal() for state
- effect() for reactions
- computed() (future)
- toObservable() only for router/guards

## 8. Routing and guards

### 8.1 Behavior

- Waits for isAuthReady
- Checks currentUser
- Redirects to /auth if unauthorized

Implementation:

- Uses toObservable(signal)
- No direct Firebase usage in guard

## 9. FORM HANDLING

### 9.1 Technology

- Angular Signals Forms

### 9.2 Features

- Reactive validation
- Strong typing
- No RxJS

### 9.3 Pattern

- signal as model
- form() for schema

### Validation rules:

- required
- minLength
- maxLength

## 10. FILE UPLOAD (AVATAR)

### 10.1 Flow

1. User selects file
2. Validate:

- format
- size

3. Upload to Cloudinary
4. Get secure_url
5. Save to Firestore

### 10.2 Constraints

- Allowed formats: PNG, JPEG, WebP, AVIF
- Max size: configurable (e.g., 5MB)

## 11. UI COMPONENTS

### 11.1 Custom Components

- Button
- Loader
- ConfirmModal
- Sidebar

### 11.2 Design Principles

- Reusable
- Standalone components
- Minimal API surface

## 12. STYLING SYSTEM

### 12.1 Technology

- SCSS

### 12.2 Style concept

- Нео-брутализм
  - Жирные границы
  - Смещение при клике
  - Изменение тени
  - Контраст и читаемость
  - Жирные шрифты

```scss
@use 'variables' as *;

@mixin inline-flex-center {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

@mixin flex-center {
  display: flex;
  align-items: center;
}

@mixin flex-column {
  display: flex;
  flex-direction: column;
}

// ======== Button =========
@mixin brutal-interactive {
  transition: $transition-main;
  cursor: pointer;

  &:hover {
    transform: translate(-1px, -1px);
    box-shadow: ($brutal-shadow-offset + 1px) ($brutal-shadow-offset + 1px) 0px 0px $ink;
  }

  &:active {
    transform: translate($brutal-shadow-offset, $brutal-shadow-offset);
    box-shadow: 0px 0px 0px 0px $ink;
  }
}

// ======== Input =========
@mixin neubrutal-input() {
  font-family: 'Geom', 'Helvetica', sans-serif;
  appearance: none;
  outline: none;
  box-sizing: border-box;
  width: 100%;

  font-family: inherit;
  font-weight: 500;
  font-size: 1rem;
  padding: 12px 16px;
  border: $brutal-border solid $ink;
  border-radius: $radius-main;
  background-color: $white;
  color: $ink;

  box-shadow: 2px 2px 0px 0px $ink;
  transition: $transition-main;

  &::placeholder {
    color: rgba($ink, 0.4);
    text-transform: lowercase;
  }

  &:focus {
    background-color: $white;
    transform: translate(-2px, -2px);
    box-shadow: $brutal-shadow-offset $brutal-shadow-offset 0px 0px $ink;
  }

  &:disabled {
    cursor: not-allowed;
    background-color: #f2f2f2;
    box-shadow: none;
    transform: none;
    opacity: 0.7;
  }
}
```

### 12.3 Approach Name

- Component-based modular SCSS with utility mixins, variables

### 12.4 Structure

- variables.scss — design tokens
- mixins.scss — reusable logic
- component-level styles

### 12.5 Key Patterns

#### 12.5.1 Mixins

Examples:

```scss
@include flex-center();
@include flex-column();
```

Purpose:

- reduce duplication
- enforce consistency

#### 12.5.2 Design Tokens

Variables:

- colors
- spacing
- typography

```scss
$bg-page: #fffef9;
$white: #ffffff;
$gray: #334155;
$yellow: #f5e86e;
$ink: #000000;
$color-success: #a3e635;

/* ===== Buttons ===== */
$color-primary: #ffde59;
$color-secondary: #d6d6f5;
$color-danger: #ff6b6b;

$brutal-border: 2px;
$brutal-shadow-offset: 4px;
$radius-main: 16px;
$transition-main: all 0.1s ease-in-out;

/* ===== Spinner loader ===== */
$spinner: rgba(255, 255, 255, 0.4);
$spinner-secondary: rgba(51, 65, 85, 0.3);
```

#### 12.5.3 Component Isolation

Each component has:

- its own .scss
- no global leakage

### 12.6 Styling Philosophy

- Mobile-first
- Minimalistic
- Functional UI
- Low visual noise

## 13. UI/UX PATTERNS

### 13.1 Inline Editing

- Click to edit
- Input replaces text
- Save on:
  - blur
  - Enter

### 13.2 Feedback

- Loading states
- Notifications
- Disabled states

### 13.3 Avatar Interaction

States:

- default (no image)
- image
- loading
- hover overlay

## 14. ERROR HANDLING

### 14.1 Firebase Errors

- Mapped to user-friendly messages:
  - invalid-email
  - wrong-password
  - email-already-in-use
  - network errors

### 14.2 Logging

- Centralized via LoggerService
- Info / Error separation

## 15. PERFORMANCE CONSIDERATIONS

- Minimal subscriptions
- Signals instead of RxJS chains
- Lazy data loading
- Optimistic UI updates

## 16. EXTENSIBILITY

- Future-ready areas:
  - Friends system
  - Pair relationships
  - Real-time chat
  - Shared data (lists, notes)
  - Notifications
  - Presence (online/offline)

## 17. SUMMARY

The project is a structured, minimal, and extensible web application built with:

- Angular 21
- Firebase (Auth + Firestore)
- Cloudinary (media storage)
- Signals-based architecture

Key characteristics:

- Strong separation of concerns
- Minimal dependencies
- Clean reactive model
- Scalable architecture

The MVP focuses on:

- authentication
- profile management
- clean UI foundation

# Authentication & Role-Based Access Control Setup Guide

## Overview
This guide covers the new Google OAuth integration and role-based access control (RBAC) system implemented in the We4X Community Connect Hub.

## Features Implemented

### 1. Google OAuth Integration
- **Login Page**: Added "Continue with Google" button
- **Register Page**: Added "Sign up with Google" button
- **Automatic Redirect**: After successful OAuth login, users are redirected based on their role

### 2. Role-Based Access Control (RBAC)
Three access levels are supported:
- **User**: Default role, can access posts, events, dashboard
- **Moderator**: Can access all user features + moderation tools
- **Admin**: Can access everything including admin dashboard

### 3. Role-Based Navigation
- **Admin users** → Auto-redirect to `/admin` dashboard
- **Regular users** → Auto-redirect to `/dashboard`
- **Non-authenticated** → Stay on login/register

## Setup Instructions

### Google OAuth Configuration

1. **Set up Google OAuth in Supabase:**
   - Go to Supabase Project Settings → Authentication → Providers
   - Enable Google OAuth provider
   - Add your Google OAuth credentials:
     - Client ID
     - Client secret
   - Set authorized redirect URI to your app domain

2. **Environment Variables** (already configured):
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`

### Database Tables Required

The system uses the following tables:
- **profiles**: User profile information
- **user_roles**: User role assignments
- **posts**: Post content
- **comments**: Comments on posts
- **post_likes**: User likes on posts

## Implementation Details

### Auth Context (`src/contexts/AuthContext.tsx`)
New method added:
```typescript
signInWithGoogle: () => Promise<{ error: Error | null }>;
```

### Protected Route Component (`src/hooks/useRoleBasedAccess.tsx`)
```typescript
<ProtectedRoute requiredRole="admin">
  <AdminDashboard />
</ProtectedRoute>
```

Supported roles:
- `"user"` (default)
- `"moderator"`
- `"admin"`

### Role-Based Navigation Hook
```typescript
const { getDefaultRoute, canAccessAdmin } = useRoleBasedNavigation();
```

## Protected Routes

### User-Protected (requires authentication):
- `/dashboard`
- `/profile`
- `/notifications`
- `/posts/new` (post creation)

### Admin-Protected (requires admin role):
- `/admin/*` (all admin routes)

## OAuth Flow Diagram

```
User clicks "Continue with Google"
         ↓
Supabase Auth Opens Google OAuth
         ↓
User approves/logs in with Google
         ↓
Google redirects back to app with session
         ↓
AuthContext fetches profile & roles
         ↓
Role-based navigation redirects to appropriate dashboard
```

## Testing the Setup

### Test User Authentication:
1. Visit `/login` or `/register`
2. Click "Continue with Google"
3. Authenticate with your Google account
4. Verify redirect to appropriate dashboard

### Test Role-Based Access:
1. Create users with different roles in Supabase
2. Sign in with each user
3. Verify correct dashboard is displayed:
   - Admin → `/admin`
   - User → `/dashboard`

### Test Protected Routes:
1. While logged out, try accessing `/dashboard`
2. Should be redirected to `/login`
3. After login, should access dashboard

## Troubleshooting

### OAuth Not Working:
- Check Supabase Google OAuth provider is enabled
- Verify redirect URI matches your app domain
- Check browser console for errors

### Role-Based Redirect Not Working:
- Ensure user has role assigned in `user_roles` table
- Check AuthContext is properly wrapped around app
- Verify roles are fetched after login

### Protected Routes Not Protecting:
- Ensure ProtectedRoute component is wrapping the route
- Check requiredRole prop is set correctly
- Verify user roles are loaded before route renders

## File Structure

```
src/
├── contexts/
│   └── AuthContext.tsx (+ signInWithGoogle method)
├── hooks/
│   └── useRoleBasedAccess.tsx (new)
│       ├── ProtectedRoute component
│       └── useRoleBasedNavigation hook
├── pages/
│   ├── Login.tsx (+ Google OAuth button + auto-redirect)
│   └── Register.tsx (+ Google OAuth button + auto-redirect)
└── App.tsx (+ ProtectedRoute wrappers)
```

## Notes

- Sonner toast is used for success/error messages (replaces old toast system)
- Auth state is persisted in localStorage automatically
- Token refresh is handled automatically by Supabase
- Users are automatically logged out on tab close (if session expires)

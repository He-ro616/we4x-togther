import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"; // Import Outlet
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/hooks/useRoleBasedAccess";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Events from "./pages/Events";
import Posts from "./pages/Posts";
import PostDetail from "./pages/PostDetail";
import PostCreate from "./pages/PostCreate";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile"; // Import Profile
import UserProfile from "./pages/UserProfile"; // Import UserProfile
import EventCreate from "./pages/EventCreate"; // Import EventCreate
import EventDetail from "./pages/EventDetail"; // Import EventDetail
import Notifications from "./pages/Notifications"; // Import Notifications
import { AdminLayout } from "./components/layout/AdminLayout"; // Import AdminLayout
import AdminDashboard from "./pages/admin/Dashboard"; // Import AdminDashboard
import AdminUsers from "./pages/admin/Users"; // Import AdminUsers
import AdminEvents from "./pages/admin/Events"; // Import AdminEvents
import AdminPosts from "./pages/admin/Posts"; // Import AdminPosts
import AdminAnalytics from "./pages/admin/Analytics"; // Import AdminAnalytics
import AdminSettings from "./pages/admin/Settings"; // Import AdminSettings
import AdminControlCenter from "./pages/admin/ControlCenter"; // Import AdminControlCenter
import PrivacyPolicy from "./pages/PrivacyPolicy"; // Import PrivacyPolicy
import EventRegister from "./pages/EventRegister";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} /> {/* New Event Detail Route */}
            <Route path="/events/:eventId/register" element={
              <ProtectedRoute>
                <EventRegister />
              </ProtectedRoute>
            } />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/posts" element={<Posts />} />
            <Route path="/posts/new" element={
              <ProtectedRoute>
                <PostCreate />
              </ProtectedRoute>
            } />
            <Route path="/posts/:id" element={<PostDetail />} />
            
            {/* Dashboard and nested routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Outlet />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="events/new" element={<EventCreate />} /> {/* New Event Create Route */}
              <Route path="events/:eventId/edit" element={<EventCreate />} /> {/* Edit Event Route */}
            </Route>

            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/users/:userId" element={<UserProfile />} />
            <Route path="/notifications" element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            } /> {/* New Notifications Route */}
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<AdminDashboard />} />
              <Route path="control-center" element={<AdminControlCenter />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="events" element={<AdminEvents />} />
              <Route path="posts" element={<AdminPosts />} />
              <Route path="analytics" element={<AdminAnalytics />} />
              <Route path="google-forms" element={<GoogleFormsManager />} />
              <Route path="settings" element={<AdminSettings />} />
              {/* Other admin routes will go here */}
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

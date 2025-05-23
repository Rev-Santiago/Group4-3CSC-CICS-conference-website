import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import App, { AuthContext } from "../App";
import Home from "../pages/Home/Home";
import CallForPapersPage from "../pages/CallForPapersPage/CallForPapersPage";
import ContactPage from "../pages/ContactPage/ContactPage";
import PartnersPage from "../pages/PartnersPage/PartnersPage";
import CommitteePage from "../pages/CommitteePage/CommitteePage";
import EventsHistoryPage from "../pages/EventsHistoryPage/EventsHistoryPage";
import RegistrationAndFeesPage from "../pages/RegistrationAndFees/RegistrationAndFeesPage";
import PublicationPage from "../pages/PublicationPage/PublicationPage";
import SchedulePage from "../pages/SchedulePage/SchedulePage";
import VenuePage from "../pages/VenuePage/VenuePage";
import KeynoteSpeakersPage from "../pages/KeynoteSpeakersPage/KeynoteSpeakersPage";
import InvitedSpeakersPage from "../pages/InvitedSpeakersPage/InvitedSpeakersPage";
import LoginPage from "../pages/LoginPage/LoginPage";
import AdminDashboard from "../pages/AdminDashboard/AdminDashboard";
// import AdminPages from "../pages/AdminPages/AdminPages";
import MiniDrawer from "../components/miniDrawer/MiniDrawer";
import SearchResultPage from "../pages/SearchResultPage/SearchResultPage";
import AdminEventsPage from "../pages/AdminEventsPage/AdminEventsPage";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import RegisterPage from "../pages/RegisterPage/RegisterPage";
import AdminAccountPage from "../pages/AdminAccountPage/AdminAccountPage";
import AdminUserManagementPage from "../pages/AdminUserManagementPage/AdminUserManagementPage";
import AdminPublicationPage from "../pages/AdminPublicationsPage/AdminPublicationsPage"
import ForgotPassword from "../pages/ForgotPassword/ForgotPassword";
import ResetPassword from "../pages/ResetPassword/ResetPassword";

// ✅ Function to protect routes (redirects if not authenticated)
function ProtectedRoute() {
    const { auth } = useContext(AuthContext);
    return auth ? <Outlet /> : <Navigate to="/login" />;
}

const AdminLayout = () => {
    return (
      <MiniDrawer>  {/* ✅ MiniDrawer wraps all admin pages */}
        <Outlet />
      </MiniDrawer>
    );
  };

  const Routes = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Home /> },
            { path: "/search", element: <SearchResultPage /> },
            { path: "/call-for-papers", element: <CallForPapersPage /> },
            { path: "/contact", element: <ContactPage /> },
            { path: "/partners", element: <PartnersPage /> },
            { path: "/committee", element: <CommitteePage /> },
            { path: "/event-history", element: <EventsHistoryPage /> },
            { path: "/registration-and-fees", element: <RegistrationAndFeesPage /> },
            { path: "/publication", element: <PublicationPage /> },
            { path: "/schedule", element: <SchedulePage /> },
            { path: "/venue", element: <VenuePage /> },
            { path: "/keynote-speakers", element: <KeynoteSpeakersPage /> },
            { path: "/invited-speakers", element: <InvitedSpeakersPage /> },
            { path: "/login", element: <LoginPage /> },
            { path: "/register", element: <RegisterPage /> },
            {
                path: "/forgot-password",
                element: <ForgotPassword />,
              },
              {
                path: "/reset-password/:token",
                element: <ResetPassword />,
              },
            {
                path: "/admin-dashboard",
                element: <ProtectedRoute />,
                children: [
                    { element: <AdminLayout />, children: [
                        { index: true, element: <AdminDashboard /> },
                        { path: "events", element: <AdminEventsPage /> },
                        { path: "publications", element: <AdminPublicationPage /> },
                        { path: "account", element: <AdminAccountPage /> },
                        { path: "user-management", element: <AdminUserManagementPage /> },                       
                    ]}
                ],
            },

            // ✅ Add this wildcard route for handling 404 pages
            { path: "*", element: <NotFoundPage /> },
        ],
    },
]);

export default Routes;

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

// ✅ Function to protect routes (redirects if not authenticated)
function ProtectedRoute() {
    const { auth } = useContext(AuthContext);
    return auth ? <Outlet /> : <Navigate to="/login" />;
}

const Routes = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { index: true, element: <Home /> },
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

            // ✅ Fix: Route for Admin Dashboard
            {
                path: "/admin-dashboard",
                element: <ProtectedRoute />, // Protect this route
                children: [{ index: true, element: <AdminDashboard /> }],
            },
        ],
    },
]);

export default Routes;

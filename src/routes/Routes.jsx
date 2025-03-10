import { createBrowserRouter } from "react-router-dom";
import App from "../App";
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

const Routes = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: '/call-for-papers',
                element: <CallForPapersPage />
            },
            {
                path: '/contact',
                element: <ContactPage />
            },
            {
                path: '/partners',
                element: <PartnersPage />
            },
            {
                path: '/committee',
                element: <CommitteePage />
            },
            {
                path: '/event-history',
                element: <EventsHistoryPage />
            },    
            {
                path: '/registration-and-fees',
                element: <RegistrationAndFeesPage />
            },          
            {
                path: '/publication',
                element: <PublicationPage />
            },   
            {
                path: '/schedule',
                element: <SchedulePage />
            }, 
            {
                path: '/venue',
                element: <VenuePage />
            }, 
        ]
    }
]);

export default Routes;

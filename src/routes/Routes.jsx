import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import CallForPapersPage from "../pages/CallForPapersPage/CallForPapersPage"; 
import ContactPage from "../pages/ContactPage/ContactPage";
import PartnersPage from "../pages/PartnersPage/PartnersPage";

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
        ]
    }
]);

export default Routes;

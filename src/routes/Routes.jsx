import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home/Home";
import CallForPapersPage from "../pages/CallForPapersPage/CallForPapersPage"; // Import new page

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
            }
        ]
    }
]);

export default Routes;

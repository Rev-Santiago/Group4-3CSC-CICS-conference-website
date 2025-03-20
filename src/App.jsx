import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import BaseNavbar from "./pages/globalLayout/BaseNavbar/BaseNavbar.jsx";
import BaseFooter from "./pages/globalLayout/BaseFooter/BaseFooter.jsx";
import LoaderPage from "./pages/LoaderPage/LoaderPage.jsx";
import { useState, createContext, useEffect } from "react";

export const AuthContext = createContext(null); // ✅ Create Auth Context

function App() {
    const [auth, setAuth] = useState(null); 

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            setAuth(token);
        }
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth }}>
            <Box sx={{ maxWidth: "1300px", width: "100%", margin: "0 auto", padding: "0 20px" }}>
                <BaseNavbar />
                <Outlet /> {/* Renders the current page */}
            </Box>
            <BaseFooter />
        </AuthContext.Provider>
    );
}

export default App;

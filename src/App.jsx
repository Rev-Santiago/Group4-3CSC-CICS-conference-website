import { Outlet, useNavigation, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import BaseNavbar from "./pages/globalLayout/BaseNavbar/BaseNavbar.jsx";
import BaseFooter from "./pages/globalLayout/BaseFooter/BaseFooter.jsx";
import LoaderPage from "./pages/LoaderPage/LoaderPage.jsx";
import { useState, createContext, useEffect } from "react";

export const AuthContext = createContext(null); // ✅ Create Auth Context

function App() {
  const [auth, setAuth] = useState(null);
  const { state } = useNavigation();
  const location = useLocation(); // ✅ Get current route

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuth(token);
    }
  }, []);

  // ✅ Hide Navbar & Footer on Admin Dashboard
  const hideLayout = location.pathname.startsWith("/admin-dashboard");

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <div> {/* Wrap everything in a single parent */}
        <Box sx={{ maxWidth: "1100px", width: "100%", margin: "0 auto", padding: "0 20px" }}>
          {!hideLayout && <BaseNavbar />}

          {state === "loading" ? <LoaderPage /> : <Outlet />}
        </Box>
        {!hideLayout && <BaseFooter />}
      </div>
    </AuthContext.Provider>
  );
}

export default App;

import { Outlet, useNavigation, useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { useState, createContext, useEffect } from "react";
import BaseNavbar from "./pages/globalLayout/BaseNavbar/BaseNavbar.jsx";
import BaseFooter from "./pages/globalLayout/BaseFooter/BaseFooter.jsx";
import LoaderPage from "./pages/LoaderPage/LoaderPage.jsx";

export const AuthContext = createContext(null);
export const LayoutContext = createContext(null);

function App() {
  const [auth, setAuth] = useState(null);
  const [hideLayout, setHideLayout] = useState(false);
  const { state } = useNavigation();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuth(token);
    }
  }, []);

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    await fetch("http://localhost:5000/api/logout", {
      method: "POST",
      credentials: "include",
    });
    setAuth(null);
    navigate("/login");
  };

  const isAdminRoute = location.pathname.startsWith("/admin-dashboard");
  const shouldHideLayout = hideLayout || isAdminRoute;

  return (
    <AuthContext.Provider value={{ auth, setAuth, handleLogout }}>
      <LayoutContext.Provider value={{ hideLayout, setHideLayout }}>
        <div>
          {/* ✅ Conditionally Apply Layout Only for Non-Admin Pages */}
          {!shouldHideLayout ? (
            <Box sx={{ maxWidth: "1100px", width: "100%", margin: "0 auto", padding: "0 20px" }}>
              <BaseNavbar />
              {state === "loading" ? <LoaderPage /> : <Outlet />}
            </Box>
          ) : (
            <Outlet /> // Directly render for Admin pages
          )}

          {!shouldHideLayout && <BaseFooter />}
        </div>
      </LayoutContext.Provider>
    </AuthContext.Provider>
  );
}


export default App;

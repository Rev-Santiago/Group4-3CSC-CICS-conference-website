import { Outlet, useNavigation, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import BaseNavbar from "./pages/globalLayout/BaseNavbar/BaseNavbar.jsx";
import BaseFooter from "./pages/globalLayout/BaseFooter/BaseFooter.jsx";
import LoaderPage from "./pages/LoaderPage/LoaderPage.jsx";
import { useState, createContext, useEffect } from "react";

export const AuthContext = createContext(null);
export const LayoutContext = createContext(null); // ✅ Context for layout control

function App() {
  const [auth, setAuth] = useState(null);
  const [hideLayout, setHideLayout] = useState(false); // ✅ Track layout visibility
  const { state } = useNavigation();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuth(token);
    }
  }, []);

  // ✅ Hide layout for 404 pages or admin routes
  const isAdminRoute = location.pathname.startsWith("/admin-dashboard");
  const shouldHideLayout = hideLayout || isAdminRoute;

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <LayoutContext.Provider value={{ hideLayout, setHideLayout }}>
        <div>
          <Box sx={{ maxWidth: "1100px", width: "100%", margin: "0 auto", padding: "0 20px" }}>
            {!shouldHideLayout && <BaseNavbar />} {/* ✅ Hide for admin & 404 */}
            {state === "loading" ? <LoaderPage /> : <Outlet />}
          </Box>
          {!shouldHideLayout && <BaseFooter />} {/* ✅ Hide for admin & 404 */}
        </div>
      </LayoutContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;

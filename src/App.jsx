import { Outlet, useNavigation, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import BaseNavbar from "./pages/globalLayout/BaseNavbar/BaseNavbar.jsx";
import BaseFooter from "./pages/globalLayout/BaseFooter/BaseFooter.jsx";
import LoaderPage from "./pages/LoaderPage/LoaderPage.jsx";
import { useState, createContext, useEffect } from "react";

export const AuthContext = createContext(null);
export const LayoutContext = createContext(null); // ✅ New Context

function App() {
  const [auth, setAuth] = useState(null);
  const [hideLayout, setHideLayout] = useState(false); // ✅ State for hiding layout
  const { state } = useNavigation();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setAuth(token);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <LayoutContext.Provider value={{ hideLayout, setHideLayout }}>
        <div>
          <Box sx={{ maxWidth: "1100px", width: "100%", margin: "0 auto", padding: "0 20px" }}>
            {!hideLayout && <BaseNavbar />}  {/* ✅ Hide dynamically */}
            {state === "loading" ? <LoaderPage /> : <Outlet />}
          </Box>
          {!hideLayout && <BaseFooter />}  {/* ✅ Hide dynamically */}
        </div>
      </LayoutContext.Provider>
    </AuthContext.Provider>
  );
}

export default App;

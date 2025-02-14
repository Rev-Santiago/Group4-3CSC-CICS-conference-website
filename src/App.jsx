import { Outlet } from "react-router-dom";
import BaseNavbar from "./pages/globalLayout/BaseNavbar/BaseNavbar.jsx"; // ✅ Import BaseNavbar

function App() {
  return (
    <>
      <BaseNavbar />  {/* ✅ Navbar will be displayed on all pages */}
      <Outlet />  {/* Renders nested routes like Home */}
    </>
  );
}

export default App;

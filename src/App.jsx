import { Outlet } from "react-router-dom";
import BaseNavbar from "./pages/globalLayout/BaseNavbar/BaseNavbar.jsx";
import BaseFooter from "./pages/globalLayout/BaseFooter/BaseFooter.jsx";

function App() {
  return (
    <>
      <BaseNavbar />  
      <Outlet />  {/* Renders nested routes like Home */}
      <BaseFooter />
    </>
  );
}

export default App;

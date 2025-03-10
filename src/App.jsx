import { Outlet, useNavigation } from "react-router-dom";
import { Box } from '@mui/material';
import BaseNavbar from "./pages/globalLayout/BaseNavbar/BaseNavbar.jsx";
import BaseFooter from "./pages/globalLayout/BaseFooter/BaseFooter.jsx";
import LoaderPage from "./pages/LoaderPage/LoaderPage.jsx"; 

function App() {
  const { state } = useNavigation(); // Get loading state

  return (
    <>
      <Box sx={{ maxWidth: '1300px', width: '100%', margin: '0 auto', padding: '0 20px' }}>
        <BaseNavbar />
        {state === "loading" ? <LoaderPage /> : <Outlet />} {/* Show LoaderPage when loading */}
      </Box>
      <BaseFooter />
    </>
  );
}

export default App;

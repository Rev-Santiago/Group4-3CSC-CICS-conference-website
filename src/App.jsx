import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
      <h1>Global Layout</h1>
      <Outlet />  {/* Renders nested routes like Home */}
    </>
  );
}

export default App;

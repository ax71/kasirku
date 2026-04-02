import { RouterProvider } from "react-router-dom";
import "../styles/global.css";
import { router } from "../routes";

function App() {
  return <RouterProvider router={router} />;
}

export default App;

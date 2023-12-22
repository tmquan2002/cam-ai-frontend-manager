import { useRoutes } from "react-router-dom";
import LoginPageProtected from "../pages/common/login/LoginPageProtected";

const ProtectedRoute = () => {
  let element = useRoutes([
    {
      path: "/profile",
      element: <LoginPageProtected />,
      index: true,
    }
  ]);
  return element;
};

export default ProtectedRoute;
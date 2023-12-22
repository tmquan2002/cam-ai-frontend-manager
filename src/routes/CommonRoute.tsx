import { useRoutes } from "react-router-dom";
import LoginPage from "../pages/common/login/LoginPage";

const CommonRoute = () => {

  let element = useRoutes([
    {
      path: "",
      element: <LoginPage />,
      index: true,
    }
  ]);
  return element;
};

export default CommonRoute;
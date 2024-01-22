import { useRoutes } from "react-router-dom";
import CommonRoute from "./CommonRoute";
import LoginPage from "../pages/common/login/LoginPage";
import ShopRoute from "./ShopRoute";
import ShopHomePage from "../pages/shop/ShopHomePage";
import ShopDetailPage from "../pages/shop/ShopDetailPage";
import Notification from "../components/notification/Notification";

const AppRoute = () => {
  return useRoutes([
    {
      element: <CommonRoute />,
      children: [
        {
          path: "/login",
          element: <LoginPage />,
          index: true,
        },
      ],
    },
    {
      path: "shop",
      element: <ShopRoute />,
      children: [
        {
          path: "",
          element: <ShopHomePage />,
          index: true,
        },
        {
          path: "detail",
          element: <ShopDetailPage />,
        },
        {
          path: "noti",
          element: <Notification />,
        },
      ],
    },
  ]);
};

export default AppRoute;

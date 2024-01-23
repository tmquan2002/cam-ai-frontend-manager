import { useRoutes } from "react-router-dom";
import CommonRoute from "./CommonRoute";
import LoginPage from "../pages/common/login/LoginPage";
import ShopRoute from "./ShopRoute";
import ShopHomePage from "../pages/shop/ShopHomePage";
import ShopDetailPage from "../pages/shop/ShopDetailPage";
import ShopReportPage from "../pages/shop/ShopReportPage";
import BrandDetailPage from "../pages/brand/BrandDetailPage";
import ShopManagerProfilePage from "../pages/shop/ShopManagerProfilePage";
import BrandRoute from "./BrandRoute";
import BrandShopDetailPage from "../pages/shop/BrandShopDetailPage";

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
          path: "report",
          element: <ShopReportPage />,
        },
        {
          path: "brand/detail",
          element: <BrandShopDetailPage />,
        },
        {
          path: "profile",
          element: <ShopManagerProfilePage />,
        },
      ],
    },
    {
      path: "/brand",
      element: <BrandRoute />,
      children: [
        {
          path: "",
          element: <BrandDetailPage />,
        },
        {
          path: "profile",
          element: <ShopManagerProfilePage />,
        },
      ],
    },
  ]);
};

export default AppRoute;

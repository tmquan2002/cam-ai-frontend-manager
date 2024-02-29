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
import CreateShop from "../pages/brand/CreateShop";
import ShopDetailPageManager from "../pages/brand/ShopDetailPageManager";
import CommonLandingPage from "../pages/common/Landing/CommonLandingPage";
import BrandManagerProfilePage from "../pages/brand/BrandManagerProfilePage";
import CreateEmployeePage from "../pages/shop/CreateEmployeePage";
import EmployeeDetailPage from "../pages/shop/EmployeeDetailPage";
import IncidentPage from "../pages/shop/IncidentPage";
import IncidentDetail from "../pages/shop/IncidentDetail";
import EmployeeListPage from "../pages/shop/EmployeeListPage";
import BrandAccountPage from "../pages/brand/BrandAccountPage";

const AppRoute = () => {
  return useRoutes([
    {
      element: <CommonRoute />,
      children: [
        {
          path: "",
          element: <CommonLandingPage />,
        },
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
        {
          path: "employee",
          element: <EmployeeListPage />,
        },
        {
          path: "employee/create",
          element: <CreateEmployeePage />,
        },
        { path: "employee/:id", element: <EmployeeDetailPage /> },
        {
          path: "overview",
          element: <IncidentPage />,
        },
        {
          path: "incident/:id",
          element: <IncidentDetail />,
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
          path: "account",
          element: <BrandAccountPage />,
        },
        {
          path: "profile",
          element: <BrandManagerProfilePage />,
        },
        {
          path: "create/shop",
          element: <CreateShop />,
        },
        {
          path: "shop/:id",
          element: <ShopDetailPageManager />,
        },
      ],
    },
  ]);
};

export default AppRoute;

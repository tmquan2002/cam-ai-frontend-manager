import { useRoutes } from "react-router-dom";
import AccountDetailPage from "../pages/brand/AccountDetailPage";
import ShopListPage from "../pages/brand/ShopListPage";
import ShopIncidentListPage from "../pages/shop/ShopIncidentListPage";
import IncidentListPage from "../pages/brand/IncidentListPage";
import ShopIncidentDetailPage from "../pages/brand/ShopIncidentDetailPage";
import ShopEmployeeDetailPage from "../pages/brand/ShopEmployeeDetailPage";
import { NothingFoundBackground } from "../pages/common/404/NothingFoundBackground";
import BrandReportPage from "../pages/brand/BrandReportPage";
import EdgeBoxListPage from "../pages/brand/EdgeBoxListPage";
import CameraDetailPage from "../pages/brand/CameraDetailPage";
import IncidentReportPage from "../pages/shop/report/incident/IncidentReportTab";
import { InteractionReportPage } from "../pages/shop/report/interaction/InteractionReportPage";
import IncidentReportPageManager from "../pages/brand/report/incident/IncidentReportPageManager";
import InteractionReportPageManager from "../pages/brand/report/interaction/InteractionReportPageManager";
import LoginPage from "../pages/common/login/LoginPage";
import CreateEmployeePage from "../pages/shop/CreateEmployeePage";
import EmployeeDetailPage from "../pages/shop/EmployeeDetailPage";
import EmployeeListPage from "../pages/shop/EmployeeListPage";
import IncidentDetail from "../pages/shop/IncidentDetail";
import ShopCalendar from "../pages/shop/ShopCalendar";
import ShopCalendarSetting from "../pages/shop/ShopCalendarSetting";
import ShopDetailPage from "../pages/shop/ShopDetailPage";
import ShopHomePage from "../pages/shop/ShopHomePage";
import ShopInteractionPage from "../pages/shop/ShopInteractionPage";
import ShopManagerProfilePage from "../pages/shop/ShopManagerProfilePage";
import BrandRoute from "./BrandRoute";
import CommonRoute from "./CommonRoute";
import ShopRoute from "./ShopRoute";
import BrandShopDetailPage from "../pages/shop/BrandShopDetailPage";
import BrandShopManagerListPage from "../pages/brand/BrandShopManagerListPage";
import BrandEmployeeListPage from "../pages/brand/BrandEmployeeListPage";
import ShopDetailPageManager from "../pages/brand/ShopDetailPageManager";
import BrandManagerProfilePage from "../pages/brand/BrandManagerProfilePage";
import CreateShop from "../pages/brand/CreateShop";
import CreateManagerPage from "../pages/brand/manager/CreateManagerPage";
import BrandInteractionList from "../pages/brand/BrandInteractionList";
import CountEmployeeReportPageManager from "../pages/brand/report/employee/CountEmployeeReportPageManager";

const AppRoute = () => {
  return useRoutes([
    {
      element: <CommonRoute />,
      children: [
        {
          path: "*",
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
          path: "incident",
          element: <ShopIncidentListPage />,
        },
        {
          path: "interaction",
          element: <ShopInteractionPage />,
        },
        {
          path: "detail",
          element: <ShopDetailPage />,
        },

        // {
        //   path: "brand/detail",
        //   element: <BrandShopDetailPage />,
        // },
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
          path: "incident/:id",
          element: <IncidentDetail />,
        },
        {
          path: "camera/:id",
          element: <CameraDetailPage />,
        },

        {
          path: "report/incident",
          element: <IncidentReportPage />,
        },
        {
          path: "report/interaction",
          element: <InteractionReportPage />,
        },
        {
          path: "calendar",
          element: <ShopCalendar events={[]} />,
        },
        {
          path: "calendar/setting",
          element: <ShopCalendarSetting />,
        },
      ],
    },
    {
      path: "/brand",
      element: <BrandRoute />,
      children: [
        {
          path: "",
          element: <BrandShopDetailPage />,
        },
        {
          path: "account",
          element: <BrandShopManagerListPage />,
        },
        {
          path: "account/:id",
          element: <AccountDetailPage />,
        },
        {
          path: "employee",
          element: <BrandEmployeeListPage />,
        },
        {
          path: "employee/:id",
          element: <ShopEmployeeDetailPage />,
        },
        {
          path: "shop",
          element: <ShopListPage />,
        },
        {
          path: "shop/:id",
          element: <ShopDetailPageManager />,
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
          path: "create/manager",
          element: <CreateManagerPage />,
        },
        { path: "incident", element: <IncidentListPage /> },
        { path: "interaction", element: <BrandInteractionList /> },
        { path: "incident/:id", element: <ShopIncidentDetailPage /> },
        {
          path: "edgeBox",
          element: <EdgeBoxListPage />,
        },
        {
          path: "report",
          element: <BrandReportPage />,
        },
        {
          path: "camera/:id",
          element: <CameraDetailPage />,
        },
        {
          path: "report/count/employee",
          element: <CountEmployeeReportPageManager />,
        },
        {
          path: "report/incident",
          element: <IncidentReportPageManager />,
        },
        {
          path: "report/interaction",
          element: <InteractionReportPageManager />,
        },
      ],
    },
    {
      path: "*",
      element: <NothingFoundBackground />,
    },
  ]);
};

export default AppRoute;

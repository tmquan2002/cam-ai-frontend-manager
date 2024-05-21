import { useRoutes } from "react-router-dom";
import AccountDetailPage from "../pages/brand/AccountDetailPage";
import BrandEmployeeListPage from "../pages/brand/BrandEmployeeListPage";
import BrandInteractionList from "../pages/brand/BrandInteractionList";
import BrandMainPage from "../pages/brand/BrandMainPage";
import BrandManagerProfilePage from "../pages/brand/BrandManagerProfilePage";
import BrandReportPage from "../pages/brand/BrandReportPage";
import BrandShopManagerListPage from "../pages/brand/BrandShopManagerListPage";
import CameraDetailPage from "../pages/brand/CameraDetailPage";
import CreateShop from "../pages/brand/CreateShop";
import EdgeBoxListPage from "../pages/brand/EdgeBoxListPage";
import IncidentListPage from "../pages/brand/IncidentListPage";
import ShopDetailPageManager from "../pages/brand/ShopDetailPageManager";
import ShopEmployeeDetailPage from "../pages/brand/ShopEmployeeDetailPage";
import ShopIncidentDetailPage from "../pages/brand/ShopIncidentDetailPage";
import CreateManagerPage from "../pages/brand/manager/CreateManagerPage";
import CountEmployeeReportPageManager from "../pages/brand/report/employee/CountEmployeeReportPageManager";
import IncidentReportPageManager from "../pages/brand/report/incident/IncidentReportPageManager";
import InteractionReportPageManager from "../pages/brand/report/interaction/InteractionReportPageManager";
import { NothingFoundBackground } from "../pages/common/404/NothingFoundBackground";
import LoginPage from "../pages/common/login/LoginPage";
import HeadSupervisorMainPage from "../pages/headsupervisor/HeadSupervisorMainPage";
import CreateEmployeePage from "../pages/shop/CreateEmployeePage";
import EmployeeDetailPage from "../pages/shop/EmployeeDetailPage";
import EmployeeListPage from "../pages/shop/EmployeeListPage";
import IncidentDetail from "../pages/shop/IncidentDetail";
import ShopCalendar from "../pages/shop/ShopCalendar";
import ShopCalendarSetting from "../pages/shop/ShopCalendarSetting";
import ShopDetailPage from "../pages/shop/ShopDetailPage";
import ShopHomePage from "../pages/shop/ShopHomePage";
import EmployeeImportResultPage from "../pages/shop/EmployeeImportResultPage";
import ShopIncidentListPage from "../pages/shop/ShopIncidentListPage";
import ShopInteractionPage from "../pages/shop/ShopInteractionPage";
import ShopManagerProfilePage from "../pages/shop/ShopManagerProfilePage";
import IncidentReportPage from "../pages/shop/report/incident/IncidentReportTab";
import { InteractionReportPage } from "../pages/shop/report/interaction/InteractionReportPage";
import SupervisorMainPage from "../pages/supervisor/SupervisorMainPage";
import BrandRoute from "./BrandRoute";
import CommonRoute from "./CommonRoute";
import HeadSupervisorRoute from "./HeadSupervisorRoute";
import ShopRoute from "./ShopRoute";
import SupervisorRoute from "./SupervisorRoute";
import ShopImportResultPage from "../pages/brand/ShopImportResultPage";

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
        {
          path: "import/:id",
          element: <EmployeeImportResultPage />
        }
      ],
    },
    {
      path: "/brand",
      element: <BrandRoute />,
      children: [
        {
          path: "",
          element: <BrandMainPage />,
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
        // {
        //   path: "shop",
        //   element: <ShopListPage />,
        // },
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
        {
          path: "import/:id",
          element: <ShopImportResultPage />
        }
      ],
    },
    {
      path: "headsupervisor",
      element: <HeadSupervisorRoute />,
      children: [
        {
          path: "",
          element: <HeadSupervisorMainPage />,
        },
      ],
    },
    {
      path: "supervisor",
      element: <SupervisorRoute />,
      children: [
        {
          path: "",
          element: <SupervisorMainPage />,
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

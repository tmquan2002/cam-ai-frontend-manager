import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { getUserRole } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { ShopNavbar } from "../components/navbar/ShopNavbar";
import { AppShell, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ShopHeader from "../components/header/ShopHeader";
import { Role } from "../models/CamAIEnum";
import { useGetEmployeeProgress } from "../hooks/useFiles";
import { notifications } from "@mantine/notifications";
import { ProgressTask } from "../models/Progress";

const ShopRoute = () => {
  const [taskId, setTaskId] = useState<string | null>(null);
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [userRole, setUserRole] = useState<Role | null>(Role.ShopManager);
  const { data: dataProgress } = useGetEmployeeProgress(taskId, 1000);
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    const currentUserRole: Role | null = getUserRole();

    setUserRole(currentUserRole);
  }, []);

  useEffect(() => {
    console.log(dataProgress)
    if (dataProgress?.percent !== 100) {
      notifications.update({
        id: "uploadEmployeeProgress",
        title: "Import in progress",
        message: `${dataProgress?.detailed?.currentFinishedRecord}/${dataProgress?.detailed?.total} Done (${dataProgress?.percent ? Math.round(dataProgress?.percent) : 0} %)`,
        autoClose: false,
        loading: true,
      });
    } else {
      notifications.update({
        color: 'teal',
        id: "uploadEmployeeProgress",
        title: "Import Finished",
        message: "Upload Complete",
        loading: false,
        autoClose: 5000,
      });
      setTaskId(null)
    }
  }, [dataProgress, taskId])

  switch (userRole) {
    case Role.ShopManager:
      return (
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
          }}
        >
          <AppShell.Header>
            <ShopHeader
              mobileOpened={mobileOpened}
              desktopOpened={desktopOpened}
              toggleDesktop={toggleDesktop}
              toggleMobile={toggleMobile}
            />
          </AppShell.Header>

          <AppShell.Navbar>
            <ShopNavbar />
          </AppShell.Navbar>

          <AppShell.Main
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              backgroundColor:
                computedColorScheme === "light" ? "#f6f8fc" : "#1A1A1A",
            }}
          >
            <Outlet context={{ taskId, setTaskId }} />
          </AppShell.Main>
        </AppShell>
      );
    case Role.BrandManager:
      return <Navigate to={"/brand"} />;
    default:
      return <Navigate to={"/login"} replace />;
  }
};

export default ShopRoute;

export function useTaskShop() {
  return useOutletContext<ProgressTask>();
}

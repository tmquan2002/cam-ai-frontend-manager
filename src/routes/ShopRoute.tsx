import { Link, Navigate, Outlet, useOutletContext } from "react-router-dom";
import { getUserRole } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { ShopNavbar } from "../components/navbar/ShopNavbar";
import { AppShell, Text, rem, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ShopHeader from "../components/header/ShopHeader";
import { Role } from "../models/CamAIEnum";
import { useGetEmployeeProgress } from "../hooks/useFiles";
import { notifications } from "@mantine/notifications";
import { ProgressTask } from "../models/Task";
import { CommonConstant, POLLING_INTERVAL } from "../types/constant";
import { IconCheck } from "@tabler/icons-react";

const ShopRoute = () => {
  const [taskId, setTaskId] = useState<string | undefined>(localStorage.getItem(CommonConstant.TASK_ID) ?? undefined);
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [userRole, setUserRole] = useState<Role | null>(Role.ShopManager);
  const { data: dataProId } = useGetEmployeeProgress(taskId, POLLING_INTERVAL);
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    const currentUserRole: Role | null = getUserRole();

    setUserRole(currentUserRole);
  }, []);

  useEffect(() => {
    // console.log("in use effect")
    if (dataProId?.dataProgress?.percents !== 100) {
      notifications.update({
        id: "uploadEmployeeProgress",
        title: "Import in progress",
        message: `${dataProId?.dataProgress?.detailed?.currentFinishedRecord}/${dataProId?.dataProgress?.detailed?.total} Done (${dataProId?.dataProgress?.percents ? Math.round(dataProId?.dataProgress?.percents) : 0} %)`,
        autoClose: false,
        loading: true,
      });
    } else {
      notifications.update({
        color: 'teal',
        id: "uploadEmployeeProgress",
        title: "Import Finished",
        message: <Link to={`/shop/import/${taskId}`} style={{ textDecoration: 'none' }}><Text >View Import Detail</Text></Link>,
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        autoClose: 5000,
      });
      setTaskId(undefined)
    }
  }, [dataProId])

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

import { AppShell, Text, rem, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Link, Navigate, Outlet, useOutletContext } from "react-router-dom";
import { getUserRole } from "../context/AuthContext";
// import ShopHeader from "../components/header/ShopHeader";
import BrandHeader from "../components/header/BrandHeader";
import { BrandNavbar } from "../components/navbar/BrandNavbar";
import { Role } from "../models/CamAIEnum";
import { useGetShopProgress } from "../hooks/useFiles";
import { notifications } from "@mantine/notifications";
import { ProgressTask } from "../models/Task";
import { CommonConstant, POLLING_INTERVAL } from "../types/constant";
import { IconCheck } from "@tabler/icons-react";

const BrandRoute = () => {
  const [taskId, setTaskId] = useState<string | undefined>(
    localStorage.getItem(CommonConstant.TASK_ID) ?? undefined
  );
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [userRole, setUserRole] = useState<Role | null>(Role.BrandManager);
  const { data: dataProId } = useGetShopProgress(taskId, POLLING_INTERVAL);
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    const currentUserRole: Role | null = getUserRole();
    setUserRole(currentUserRole);
  }, []);

  useEffect(() => {
    if (dataProId?.dataProgress?.percents !== 100) {
      notifications.update({
        id: "uploadShopProgress",
        title: "Import in progress",
        message: `${dataProId?.dataProgress?.detailed?.currentFinishedRecord}/${
          dataProId?.dataProgress?.detailed?.total
        } Done (${
          dataProId?.dataProgress?.percents
            ? Math.round(dataProId?.dataProgress?.percents)
            : 0
        } %)`,
        autoClose: false,
        loading: true,
      });
    } else {
      notifications.update({
        color: "teal",
        id: "uploadShopProgress",
        title: "Import Completed",
        message: (
          <Link
            to={`/brand/import/${taskId}`}
            style={{ textDecoration: "none" }}
          >
            <Text>View Import Detail</Text>
          </Link>
        ),
        icon: <IconCheck style={{ width: rem(18), height: rem(18) }} />,
        loading: false,
        autoClose: 10000,
        withCloseButton: true,
      });
      setTaskId(undefined);
    }
  }, [dataProId]);

  switch (userRole) {
    case Role.BrandManager:
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
            <BrandHeader
              mobileOpened={mobileOpened}
              desktopOpened={desktopOpened}
              toggleDesktop={toggleDesktop}
              toggleMobile={toggleMobile}
            />
          </AppShell.Header>

          <AppShell.Navbar>
            <BrandNavbar />
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
    case Role.ShopManager:
      return <Navigate to={"/shop"} />;
    case Role.ShopSupervisor:
      return <Navigate to={"/supervisor"} />;
    default:
      return <Navigate to={"/login"} replace />;
  }
};

export default BrandRoute;

export function useTaskBrand() {
  return useOutletContext<ProgressTask>();
}

import { Navigate, Outlet } from "react-router-dom";
import { getUserRole } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { ShopNavbar } from "../components/navbar/ShopNavbar";
import { AppShell, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ShopHeader from "../components/header/ShopHeader";
import { Role } from "../models/CamAIEnum";

const ShopRoute = () => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [userRole, setUserRole] = useState<Role | null>(Role.ShopManager);
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    const currentUserRole: Role | null = getUserRole();

    setUserRole(currentUserRole);
  }, []);

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
            <Outlet />
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

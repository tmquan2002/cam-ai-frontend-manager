import { AppShell, useComputedColorScheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getUserRole } from "../context/AuthContext";
// import ShopHeader from "../components/header/ShopHeader";
import BrandHeader from "../components/header/BrandHeader";
import { BrandNavbar } from "../components/navbar/BrandNavbar";
import { Role } from "../models/CamAIEnum";

const BrandRoute = () => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [userRole, setUserRole] = useState<Role | null>(Role.BrandManager);
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  useEffect(() => {
    const currentUserRole: Role | null = getUserRole();
    setUserRole(currentUserRole);
  }, []);

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
            <Outlet />
          </AppShell.Main>
        </AppShell>
      );
    case Role.ShopManager:
      return <Navigate to={"/shop"} />;
    default:
      return <Navigate to={"/login"} replace />;
  }
};

export default BrandRoute;

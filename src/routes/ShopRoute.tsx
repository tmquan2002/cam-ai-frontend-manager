import { Navigate, Outlet } from "react-router-dom";
import { checkRole } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { RoleEnum } from "../types/enum";
import { ShopNavbar } from "../components/navbar/ShopNavbar";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ShopHeader from "../components/header/ShopHeader";

const ShopRoute = () => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [userRole, setUserRole] = useState<RoleEnum>(RoleEnum.ShopManager);
  useEffect(() => {
    const isUserRoleBrandManager: boolean | undefined = checkRole({
      Id: RoleEnum.BrandManager,
      Name: "",
    });

    const isUserRoleShopManager: boolean | undefined = checkRole({
      Id: RoleEnum.ShopManager,
      Name: "",
    });

    if (isUserRoleBrandManager) {
      setUserRole(RoleEnum.BrandManager);
    } else if (!isUserRoleShopManager) {
      setUserRole(RoleEnum.Employee);
    }
  }, []);

  switch (userRole) {
    case RoleEnum.ShopManager:
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
            <ShopHeader mobileOpened={mobileOpened} desktopOpened={desktopOpened}
              toggleDesktop={toggleDesktop} toggleMobile={toggleMobile}/>
          </AppShell.Header>

          <AppShell.Navbar>
            <ShopNavbar />
          </AppShell.Navbar>

          <AppShell.Main
            style={{
              backgroundColor: "#f2f4f7",
            }}
          >
            <Outlet />
          </AppShell.Main>
        </AppShell>
      );
    case RoleEnum.BrandManager:
      return <Navigate to={"/brand"} />;
    default:
      return (
        <Navigate
          to={"/login"}
          replace
        />
      );
  }
};

export default ShopRoute;

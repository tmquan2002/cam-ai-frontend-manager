import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { checkRole } from "../context/AuthContext";
import { RoleEnum } from "../types/enum";
// import ShopHeader from "../components/header/ShopHeader";
import BrandHeader from "../components/header/BrandHeader";
import { BrandNavbar } from "../components/navbar/BrandNavbar";

const BrandRoute = () => {
  const [mobileOpened, { toggle: toggleMobile }] = useDisclosure();
  const [desktopOpened, { toggle: toggleDesktop }] = useDisclosure(true);
  const [userRole, setUserRole] = useState<RoleEnum>(RoleEnum.BrandManager);
  useEffect(() => {
    const isUserRoleBrandManager: boolean | undefined = checkRole({
      Id: RoleEnum.BrandManager,
      Name: "",
    });

    const isUserRoleShopManager: boolean | undefined = checkRole({
      Id: RoleEnum.ShopManager,
      Name: "",
    });

    if (isUserRoleShopManager) {
      setUserRole(RoleEnum.ShopManager);
    } else if (!isUserRoleBrandManager) {
      setUserRole(RoleEnum.Employee);
    }
  }, []);

  switch (userRole) {
    case RoleEnum.BrandManager:
      return (
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 250,
            breakpoint: "sm",
            collapsed: { mobile: !mobileOpened, desktop: !desktopOpened },
          }}
        >
          <AppShell.Header>
            <BrandHeader mobileOpened={mobileOpened} desktopOpened={desktopOpened}
              toggleDesktop={toggleDesktop} toggleMobile={toggleMobile} />
          </AppShell.Header>

          <AppShell.Navbar>
            <BrandNavbar />
          </AppShell.Navbar>

          <AppShell.Main>
            <Outlet />
          </AppShell.Main>
        </AppShell>
      );
    case RoleEnum.ShopManager:
      return <Navigate to={"/shop"} />;
    default:
      return (
        <Navigate
          to={"/login"}
          replace
        />
      );
  }
};

export default BrandRoute;

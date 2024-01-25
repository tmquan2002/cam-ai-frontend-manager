import { Navigate, Outlet } from "react-router-dom";
import { checkRole } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { RoleEnum } from "../types/enum";
import { AppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
// import ShopHeader from "../components/header/ShopHeader";
import { BrandNavbar } from "../components/navbar/BrandNavbar";
import BrandHeader from "../components/header/BrandHeader";

const BrandRoute = () => {
  const [opened] = useDisclosure();
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
            width: 300,
            breakpoint: "sm",
            collapsed: { mobile: !opened },
          }}
        >
          <AppShell.Header>
            <BrandHeader />
          </AppShell.Header>

          <AppShell.Navbar>
            <BrandNavbar />
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

import { Navigate, Outlet } from "react-router-dom";
import { checkRole } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { RoleEnum } from "../types/enum";
import { ShopNavbar } from "../components/navbar/ShopNavbar";
import { AppShell, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import ShopHeader from "../components/header/ShopHeader";

const ShopRoute = () => {
  const [opened, { toggle }] = useDisclosure();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  useEffect(() => {
    const isUserHavePermission: boolean | undefined = checkRole({
      Id: RoleEnum.ShopManager,
      Name: "",
    });
    if (!isUserHavePermission) {
      setIsAuthenticated(false);
    }
  }, []);

  if (isAuthenticated) {
    return (
      <AppShell
        header={{ height: 60 }}
        navbar={{
          width: 300,
          breakpoint: "sm",
          collapsed: { mobile: !opened },
        }}
        padding={rem(32)}
      >
        <AppShell.Header>
          <ShopHeader />
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
  } else {
    return (
      <Navigate
        to={"/login"}
        replace
      />
    );
  }
};

export default ShopRoute;

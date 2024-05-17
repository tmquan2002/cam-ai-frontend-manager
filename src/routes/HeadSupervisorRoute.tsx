import { useEffect, useState } from "react";
import { getUserRole } from "../context/AuthContext";
import { Role } from "../models/CamAIEnum";
import { AppShell } from "@mantine/core";
import { Navigate, Outlet } from "react-router-dom";
import ShopSupervisorHeader from "../components/header/ShopSupervisorHeader";

const HeadSupervisorRoute = () => {
  const [userRole, setUserRole] = useState<Role | null>(
    Role.ShopHeadSupervisor
  );

  useEffect(() => {
    const currentUserRole: Role | null = getUserRole();

    setUserRole(currentUserRole);
  }, []);
  switch (userRole) {
    case Role.ShopHeadSupervisor:
      return (
        <AppShell
          header={{ height: 60 }}
          navbar={{
            width: 300,
            breakpoint: "sm",
          }}
        >
          <AppShell.Header>
            <ShopSupervisorHeader />
          </AppShell.Header>

          <AppShell.Main
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              paddingLeft: 0,
              marginLeft: 0,
            }}
          >
            <Outlet />
          </AppShell.Main>
        </AppShell>
      );

    case Role.ShopSupervisor:
      return <Navigate to={"/supervisor"} />;
    case Role.BrandManager:
      return <Navigate to={"/brand"} />;
    default:
      return <Navigate to={"/login"} replace />;
  }
};

export default HeadSupervisorRoute;

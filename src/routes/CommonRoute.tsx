import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserRole } from "../context/AuthContext";
import { Role } from "../models/CamAIEnum";

const CommonRoute = () => {
  const [userRole, setUserRole] = useState<Role | null>(Role.SystemHandler);
  useEffect(() => {
    const currentUserRole: Role | null = getUserRole();
    setUserRole(currentUserRole);
  }, []);

  switch (userRole) {
    case Role.BrandManager:
      return <Navigate to={"/brand"} />;
    case Role.ShopManager:
      return <Navigate to={"/shop"} />;
    case Role.ShopSupervisor:
      return <Navigate to={"/supervisor"} />;

    default:
      return <Outlet />;
  }
};

export default CommonRoute;

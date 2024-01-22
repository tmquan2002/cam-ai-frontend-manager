import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkRole } from "../context/AuthContext";
import { RoleEnum } from "../types/enum";

const CommonRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  useEffect(() => {
    const isUserHavePermission: boolean | undefined = checkRole({
      Id: RoleEnum.ShopManager,
      Name: "",
    });
    if (isUserHavePermission) {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <Outlet />;
  }

  return <Navigate to={"/shop"} />;
};

export default CommonRoute;

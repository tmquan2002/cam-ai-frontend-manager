import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { checkRole } from "../context/AuthContext";
import { RoleEnum } from "../types/enum";

const CommonRoute = () => {
  const [userRole, setUserRole] = useState<RoleEnum>(RoleEnum.Employee);
  useEffect(() => {
    const isUserRoleBrandManager: boolean | undefined = checkRole({
      Id: RoleEnum.BrandManager,
      Name: "",
    });

    const isUserRoleShopManager: boolean | undefined = checkRole({
      Id: RoleEnum.ShopManager,
      Name: "",
    });

    console.log(isUserRoleBrandManager, isUserRoleShopManager);

    if (isUserRoleBrandManager) {
      setUserRole(RoleEnum.BrandManager);
      return;
    }
    if (isUserRoleShopManager) {
      setUserRole(RoleEnum.ShopManager);
      return;
    }
  }, []);

  switch (userRole) {
    case RoleEnum.BrandManager:
      return <Navigate to={"/brand"} />;
    case RoleEnum.ShopManager:
      return <Navigate to={"/shop"} />;
    default:
      return <Outlet />;
  }
};

export default CommonRoute;

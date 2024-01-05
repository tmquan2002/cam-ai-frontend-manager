import { useState } from "react";
import CommonRoute from "./CommonRoute";
import ProtectedRoute from "./ProtectedRoute";

const AppRoute = () => {
  //TODO: Replace with proper redux or local storage later
  const [login, setLogin] = useState(true)

  return (
    <>
      <CommonRoute />
      {/* {login && <ProtectedRoute />} */}
    </>
  );
};

export default AppRoute;

import React from "react";
import Nav from "./Nav";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
};

export default DashboardLayout;

import { Header } from "./Header";
import Nav from "./Nav";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <>
      {/* <Header /> */}
      <Nav />
      <Outlet />
    </>
  );
};

export default DashboardLayout;

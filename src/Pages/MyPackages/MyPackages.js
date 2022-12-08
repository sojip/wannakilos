import { useEffect, useState } from "react";
import "./MyPackages.css";

const MyPackages = (props) => {
  const [packages, setpackages] = useState([]);

  useEffect(() => {
    // const getPackages = async () => {
    //     const
    // }
  }, []);

  return <div className="container">My Packages</div>;
};

export default MyPackages;

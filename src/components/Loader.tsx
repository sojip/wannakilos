import "../styles/Loader.css";
import React from "react";

export const Loader = (): JSX.Element => {
  return (
    <div className="loaderBackground">
      <div className="lds-facebook">
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="logo">
        <img
          src="https://img.icons8.com/ios-filled/50/000000/passenger-with-baggage.png"
          alt="logo"
        />
        <h1>WannaKilos</h1>
      </div>
    </div>
  );
};

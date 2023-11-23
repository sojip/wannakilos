import React from "react";
import { useEffect, useState } from "react";
import { useAuthContext } from "components/auth/useAuthContext";
import { Package } from "./type";
import { getSentPackages, getTransportedPackages } from "./utils";
import { Content } from "components/DashboardContent";
import { SentPackage } from "./SentPackage";
import { TransportedPackage } from "./TransportedPackage";
import styled from "styled-components";
import { Spinner } from "components/Spinner";
import { Infos } from "Pages/SendPackage/SendPackage";

const Wrapper = styled.div`
  max-width: 500px;
  margin: auto;
  position: relative;
`;

const MyPackages = () => {
  const { user } = useAuthContext();
  const uid = user?.id;
  const [packages, setPackages] = useState<Package[]>([]);
  const [packagesSent, setPackagesSent] = useState<Package[]>([]);
  const [packagesTransported, setPackagesTransported] = useState<Package[]>([]);
  const [isLoading, setIsLoading] = useState({
    sent: true,
    transported: true,
  });

  useEffect(() => {
    const packagesSentListener = getSentPackages(
      uid as string,
      setPackagesSent,
      setIsLoading
    );
    const packagesTransportedListener = getTransportedPackages(
      uid as string,
      setPackagesTransported,
      setIsLoading
    );

    return () => {
      packagesSentListener();
      packagesTransportedListener();
    };
  }, []);

  useEffect(() => {
    setPackages(
      [...packagesSent, ...packagesTransported].sort(function (x, y) {
        return y.timestamp.toMillis() - x.timestamp.toMillis();
      })
    );
  }, [packagesSent, packagesTransported]);

  return (
    <Content>
      <h2>My Packages</h2>
      {Object.values(isLoading).includes(true) ? (
        <Spinner />
      ) : packages.length > 0 ? (
        <Wrapper>
          {packages.map((package_) => {
            return package_.type === "sent" ? (
              <SentPackage
                key={package_.id}
                package_={package_}
                $animationOrder={packages.indexOf(package_)}
              />
            ) : (
              <TransportedPackage
                key={package_.id}
                package_={package_}
                $animationOrder={packages.indexOf(package_)}
              />
            );
          })}
        </Wrapper>
      ) : (
        <Infos>"no packages yet"</Infos>
      )}
      {/* {packages.length > 0 && (
        <Wrapper>
          {packages.map((package_) => {
            return package_.type === "sent" ? (
              <SentPackage
                key={package_.id}
                package_={package_}
                $animationOrder={packages.indexOf(package_)}
              />
            ) : (
              <TransportedPackage
                key={package_.id}
                package_={package_}
                $animationOrder={packages.indexOf(package_)}
              />
            );
          })}
        </Wrapper>
      )} */}
    </Content>
  );
};

export default MyPackages;

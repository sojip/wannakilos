import React from "react";
import { useEffect, useState } from "react";
import { useAuthContext } from "components/auth/useAuthContext";
import { toast, ToastContainer } from "react-toastify";
import { Content } from "components/DashboardContent";
import { findDetails, getUserClaims } from "./utils";
import { Request as Req } from "./utils";
import { Request } from "./Request";
import { Spinner } from "components/Spinner";
import { Infos } from "Pages/SendPackage/SendPackage";

export const MyClaims = () => {
  const { user } = useAuthContext();
  let uid = user?.id;
  const [requests, setRequests] = useState<Req[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const claims = await getUserClaims(uid as string);
        const _requests = await Promise.all(
          claims.map((claim) => findDetails(claim))
        );
        setRequests(_requests);
      } catch (e) {
        toast.error(e.message);
      }
    })();
  }, []);

  return (
    <Content>
      <ToastContainer />
      <h2>My Claims</h2>
      {requests === null ? (
        <Spinner />
      ) : requests.length > 0 ? (
        <>
          {requests.map((request) => (
            <Request key={request.id} {...request} />
          ))}
        </>
      ) : (
        <Infos>No Claims</Infos>
      )}
    </Content>
  );
};

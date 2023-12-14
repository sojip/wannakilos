import React from "react";
import { CardLarge } from "components/CardLarge";
import { Package, Dialog } from "./type";
import { DateTime } from "luxon";
import { Button } from "components/Button";
import { Status } from "./SentPackage";
import { mdiCashCheck } from "@mdi/js";
import Icon from "@mdi/react";
import { confirmDelivery } from "./utils";
import { useState } from "react";
import ConfirmationBox from "components/ConfirmationBox";

interface PackageProps {
  package_: Package;
  $animationOrder: number;
}

export const TransportedPackage = (props: PackageProps) => {
  const { package_, $animationOrder } = props;
  const [openDialog, setOpenDialog] = useState(false);

  const handlePackageDelivery = async () => {
    await confirmDelivery(package_.id);
  };

  return (
    <>
      <CardLarge $animationOrder={$animationOrder}>
        <CardLarge.Header
          value1={package_.departurePoint}
          value2={package_.arrivalPoint}
          Icon={<i className="fa-solid fa-right-long"></i>}
        />
        <CardLarge.Row
          value1={
            <>
              <i
                className="fa-solid fa-plane-departure"
                style={{ marginRight: "10px" }}
              ></i>
              {DateTime.fromISO(package_.departureDate).toLocaleString(
                DateTime.DATE_MED
              )}
            </>
          }
          value2={
            <>
              {DateTime.fromISO(package_.arrivalDate).toLocaleString(
                DateTime.DATE_MED
              )}
              <i
                className="fa-solid fa-plane-arrival"
                style={{ marginLeft: "10px" }}
              ></i>
            </>
          }
        />
        <CardLarge.Row value1={package_.bookingDetails} />
        <CardLarge.Row value1={""} value2={`${package_.numberOfKilos} kg`} />
        <CardLarge.Row
          value1={""}
          value2={`prepaid ${package_.numberOfKilos * package_.price}${
            package_.currency
          }`}
        />
        <CardLarge.Row
          value1={""}
          value2={`delivery code - ${package_.deliveryOtp}`}
        />
        {package_.status === "prepaid" && (
          <Button
            value="confirm delivery"
            onClick={() => {
              setOpenDialog(true);
            }}
          />
        )}
        {package_.paid === true && (
          <Status>
            <Icon path={mdiCashCheck} size={1} />
            paid
          </Status>
        )}
      </CardLarge>
      <ConfirmationBox
        open={openDialog}
        setOpen={setOpenDialog}
        title={"Confirm Package Delivery"}
        confirmKeyword={true}
        description={
          "Please enter the delivery code provided by the package owner"
        }
        keyword={package_.deliveryOtp}
        handleConfirmation={handlePackageDelivery}
      />
    </>
  );
};

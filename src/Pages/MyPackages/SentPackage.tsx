import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { CardLarge } from "components/CardLarge";
import { Dialog, Package } from "./type";
import { DateTime } from "luxon";
import Icon from "@mdi/react";
import { mdiPackageCheck } from "@mdi/js";
import { handleRefundRequest } from "./utils";
import { Button } from "components/Button";
import { TextField } from "@mui/material";
import ConfirmationBox from "components/ConfirmationBox";

interface PackageProps {
  package_: Package;
  $animationOrder: number;
}

const OptionButton = styled.i`
  margin: 10px;
  cursor: pointer;
`;

export const Status = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  color: var(--green);
  text-transform: capitalize;
  gap: 5px;
  padding: 5px;
`;

const Options = styled.div`
  position: absolute;
  z-index: 2;
  padding: 10px 20px;
  margin: -40px 0 0 20px;
  background-color: white;
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
`;

export const SentPackage = (props: PackageProps) => {
  const { package_, $animationOrder } = props;
  const [refundReason, setRefundReason] = useState("");
  const [openOption, setOpenOption] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const optionsRef = useRef<HTMLDivElement | null>(null);
  const iconRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    document.addEventListener("click", hideOptions);

    function hideOptions(e: MouseEvent) {
      if (e.target !== iconRef.current) {
        if (optionsRef.current !== null) {
          setOpenOption(false);
        }
      }
    }

    return () => {
      document.removeEventListener("click", hideOptions);
    };
  }, []);

  const handleClick = () => {
    setOpenOption(!openOption);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRefundReason(e.target.value);
  };

  const handlePackageRefund = async () => {
    await handleRefundRequest(package_.id, refundReason);
  };

  return (
    <>
      <CardLarge
        $animationOrder={$animationOrder}
        header={[package_.departurePoint, package_.arrivalPoint]}
        rows={[
          [
            <>
              <i
                className="fa-solid fa-plane-departure"
                style={{ marginRight: "10px" }}
              ></i>
              {DateTime.fromISO(package_.departureDate).toLocaleString(
                DateTime.DATE_MED
              )}
            </>,
            <>
              {DateTime.fromISO(package_.arrivalDate).toLocaleString(
                DateTime.DATE_MED
              )}
              <i
                className="fa-solid fa-plane-arrival"
                style={{ marginLeft: "10px" }}
              ></i>
            </>,
          ],
          [package_.bookingDetails, "", 1],
          ["", `${package_.numberOfKilos} kg`, 1],
          [
            "",
            `prepaid ${package_.numberOfKilos * package_.price}${
              package_.currency
            }`,
            1,
          ],
          ["", `delivery code - ${package_.deliveryOtp}`, 1],
        ]}
      >
        {package_.status === "delivered" ? (
          <Status>
            <Icon path={mdiPackageCheck} size={1} />
            delivered
          </Status>
        ) : (
          <OptionButton
            className="fa-solid fa-ellipsis fa-lg packageOptionsIcon"
            onClick={handleClick}
            ref={iconRef}
          />
        )}
      </CardLarge>
      {openOption && (
        <Options ref={optionsRef}>
          <Button
            value="request a refund"
            onClick={() => {
              setOpenDialog(true);
            }}
          />
        </Options>
      )}
      <ConfirmationBox
        open={openDialog}
        setOpen={setOpenDialog}
        title={"request a refund"}
        confirmKeyword={false}
        description={
          "Any problem with the transport of your package? Please tell us so we can help."
        }
        handleConfirmation={handlePackageRefund}
      >
        <TextField
          autoFocus
          margin="dense"
          type="text"
          fullWidth
          variant="standard"
          value={refundReason}
          onChange={handleChange}
          multiline
          placeholder="What is wrong?"
        />
      </ConfirmationBox>
    </>
  );
};

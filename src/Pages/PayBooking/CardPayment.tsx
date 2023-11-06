import React from "react";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { FormDatas } from "./type";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import styled from "styled-components";

const Logo = styled.img`
  width: 50px;
`;
const LogoWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

type PaymentProps = {
  data: FormDatas;
  setData: React.Dispatch<React.SetStateAction<FormDatas>>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};
export const CardPayment = ({ data, setData, handleChange }: PaymentProps) => {
  return (
    <>
      <LogoWrapper>
        <Logo
          src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
          alt="visa-logo"
        />
        <Logo
          src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
          alt="mastercard-logo"
        />
      </LogoWrapper>

      <TextField
        variant="outlined"
        name="cardNumber"
        label="Card Number"
        type="text"
        fullWidth
        value={data.card.cardNumber}
        onChange={handleChange}
        margin="normal"
        inputProps={{
          inputMode: "numeric",
          pattern: "[0-9]*",
        }}
        required
      />
      <div className="grid-wrapper">
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <DatePicker
            label="Expire On"
            views={["year", "month"]}
            value={data.card.expirationDate}
            onChange={(newValue) => {
              setData({
                ...data,
                card: {
                  ...data.card,
                  expirationDate: newValue,
                },
              });
            }}
            minDate={new Date()}
            renderInput={(params) => (
              <TextField
                margin="normal"
                variant="outlined"
                fullWidth
                {...params}
                required
              />
            )}
          />
        </LocalizationProvider>
        <TextField
          id="cvv"
          label="CVV"
          required
          value={data.card.cvv}
          onChange={handleChange}
          type="text"
          name="cvv"
          variant="outlined"
          inputProps={{
            inputMode: "numeric",
            pattern: "[0-9]*",
          }}
          fullWidth
          margin="normal"
        />
      </div>
    </>
  );
};

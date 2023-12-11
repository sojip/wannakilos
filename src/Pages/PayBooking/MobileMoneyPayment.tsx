import React from "react";
import { TextField } from "@mui/material";
import { FormDatas } from "./type";

type PaymentProps = {
  data: FormDatas;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

export const MobileMoneyPayment = ({ data, handleChange }: PaymentProps) => {
  return (
    <>
      <TextField
        variant="outlined"
        name="mobileMoney"
        label="Phone Number"
        type="text"
        fullWidth
        value={data.mobileMoney}
        onChange={handleChange}
        margin="normal"
        inputProps={{
          inputMode: "numeric",
          pattern: "[0-9]*",
        }}
        required
      />
    </>
  );
};

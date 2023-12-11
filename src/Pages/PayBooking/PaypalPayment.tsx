import React from "react";
import { TextField } from "@mui/material";
import { FormDatas } from "./type";

type PaymentProps = {
  data: FormDatas;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

export const PaypalPayment = ({ data, handleChange }: PaymentProps) => {
  return (
    <>
      <TextField
        variant="outlined"
        name="firstName"
        label="First Name"
        type="text"
        fullWidth
        value={data.paypal.firstName}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        variant="outlined"
        name="lastName"
        label="Last Name"
        type="text"
        fullWidth
        value={data.paypal.lastName}
        onChange={handleChange}
        margin="normal"
        required
      />
      <TextField
        variant="outlined"
        name="email"
        label="Paypal Email"
        type="email"
        fullWidth
        value={data.paypal.email}
        onChange={handleChange}
        margin="normal"
        required
      />
    </>
  );
};

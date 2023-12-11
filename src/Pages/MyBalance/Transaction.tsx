import { db } from "../../components/utils/firebase";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { Package } from "./MyBalance";
import { DateTime } from "luxon";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ConfirmationBox from "../../components/ConfirmationBox";
import {
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material";
import DebitCard from "../../img/debit-cards.png";
import MobileMoney from "../../img/wallet.png";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import styled from "styled-components";
import { fadeIn } from "components/Card";
import "./MyBalance.css";

type CardDatas = {
  cardNumber: string;
  expirationDate: DateTime | null;
  cvv: string;
};

type PaypalDatas = {};

type TransactionProps = {
  package_: Package;
  expanded: string | boolean;
  setexpanded: React.Dispatch<React.SetStateAction<string | boolean>>;
  $animationOrder: number;
};

const ACCORDION = styled(Accordion)<{ $order: number }>`
  animation: ${fadeIn} 350ms ease-in both;
  animation-delay: calc(${(props) => props.$order}* 100ms);
  font-family: var(--textFont);
  & > * {
    font-family: var(--textFont);s
  }
`;

const Logos = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const Logo = styled.img`
  width: 50px;
`;

export const Transaction = ({
  package_,
  expanded,
  setexpanded,
  $animationOrder,
}: TransactionProps) => {
  const [openDialog, setopenDialog] = useState(false);
  const [paymentMethod, setpaymentMethod] = useState("card");
  const [cardDatas, setcardDatas] = useState<CardDatas>({
    cardNumber: "",
    expirationDate: null,
    cvv: "",
  });
  // const [paypalDatas, setpaypalDatas] = useState({});
  // const [booking, setbooking] = useState({});

  const withdraw = async () => {
    const docRef = doc(db, "bookings", package_.id);
    await updateDoc(docRef, {
      retrieved: true,
    });
    toast.success("Withdrawall Done Successfully!");
    return;
  };

  const handleChange =
    (panel: string) => (e: React.SyntheticEvent, value: boolean) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains("withdrawal")) {
        setopenDialog(true);
        return;
      }
      console.log(panel);
      setexpanded(value ? panel : false);
    };
  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setpaymentMethod(e.target.value);
  };

  const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {};

  const handlePaypalInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {};

  const handlePaypalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <>
      <ACCORDION
        className="transaction"
        expanded={expanded as boolean}
        onChange={handleChange(package_.id)}
        $order={$animationOrder}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-content"
        >
          <div className="panel-header">
            <Typography className="text">
              {package_.numberOfKilos} Kg
            </Typography>
            <Typography className="text price">
              {package_.price * Number(package_.numberOfKilos)}{" "}
              {package_.currency}
            </Typography>
          </div>
          {package_.retrieved ? (
            <span>Retrieved</span>
          ) : (
            <button className="withdrawal">get paid</button>
          )}
        </AccordionSummary>
        <AccordionDetails>
          <div className="background-wrapper">
            <div className="details">
              <Typography className="details-title">details </Typography>
              <Typography className="text">
                {package_.bookingDetails}
              </Typography>
              <Typography className="details-title">
                departure point{" "}
              </Typography>
              <Typography className="text">
                {package_.departurePoint}
              </Typography>
              <Typography className="details-title">arrival point </Typography>
              <Typography className="text">{package_.arrivalPoint}</Typography>
              <Typography className="details-title">departure date </Typography>
              <Typography className="text">
                {DateTime.fromISO(package_.departureDate).toLocaleString(
                  DateTime.DATE_MED
                )}
              </Typography>
              <Typography className="details-title">arrival date </Typography>
              <Typography className="text">
                {DateTime.fromISO(package_.arrivalDate).toLocaleString(
                  DateTime.DATE_MED
                )}
              </Typography>
              <Typography className="details-title">goods delivered</Typography>
              <ul>
                {package_.goods.map((good) => (
                  <li key={package_.goods.indexOf(good)}>{good}</li>
                ))}
              </ul>
            </div>
          </div>
        </AccordionDetails>
      </ACCORDION>
      {openDialog && (
        <ConfirmationBox
          title="Money Withdrawall"
          confirmKeyword={false}
          handleConfirmation={withdraw}
          open={openDialog}
          setOpen={setopenDialog}
        >
          <div className="paid-amount">{`${
            Number(package_.numberOfKilos) * package_.price
          } ${package_.currency}`}</div>
          <FormControl>
            <FormLabel id="payment-method-group-label">
              How would you like to be paid please ?
            </FormLabel>
            <RadioGroup
              aria-labelledby="payment-method-group-label"
              name="radio-buttons-group"
              row
              value={paymentMethod}
              onChange={handlePaymentMethodChange}
            >
              <FormControlLabel
                value="card"
                control={<Radio />}
                label={
                  <div className="balance-payment-label">
                    <span>Card</span>
                    <img className="payment-logo" src={DebitCard} alt="" />
                  </div>
                }
              />
              <FormControlLabel
                value="paypal"
                control={<Radio />}
                label="Paypal"
              />
              <FormControlLabel
                value="mobile-money"
                control={<Radio />}
                label={
                  <div className="balance-payment-label">
                    <span>Mobile Money</span>
                    <img className="payment-logo" src={MobileMoney} alt="" />
                  </div>
                }
              />
            </RadioGroup>
          </FormControl>

          {paymentMethod === "card" && (
            <form className="cardPaymentForm">
              <Logos>
                <Logo
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  alt="visa-logo"
                  className="card-logo"
                />
                <Logo
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="mastercard-logo"
                  className="card-logo"
                />
              </Logos>

              <TextField
                variant="outlined"
                name="card-number"
                label="Card Number"
                type="text"
                fullWidth
                onChange={handleCardInputChange}
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
                    value={cardDatas.expirationDate}
                    onChange={(newValue) => {
                      setcardDatas({
                        ...cardDatas,
                        expirationDate: newValue,
                      });
                    }}
                    minDate={DateTime.fromJSDate(new Date())}
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
                  onChange={handleCardInputChange}
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
            </form>
          )}

          {paymentMethod === "paypal" && (
            <form className="paypalPaymentForm">
              <TextField
                variant="outlined"
                name="firstName"
                label="First Name"
                type="text"
                fullWidth
                onChange={handlePaypalInputChange}
                margin="normal"
                required
              />
              <TextField
                variant="outlined"
                name="lastName"
                label="Last Name"
                type="text"
                fullWidth
                onChange={handlePaypalInputChange}
                margin="normal"
                required
              />
              <TextField
                variant="outlined"
                name="email"
                label="Paypal Email"
                type="email"
                fullWidth
                onChange={handlePaypalInputChange}
                margin="normal"
                required
              />
            </form>
          )}
        </ConfirmationBox>
      )}
    </>
  );
};

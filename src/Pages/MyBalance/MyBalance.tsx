import React from "react";
import "./MyBalance.css";
import { useEffect, useState } from "react";
import {
  query,
  collection,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../components/utils/firebase";
import { useAuthContext } from "components/auth/useAuthContext";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DateTime } from "luxon";
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
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Package = {
  id: string;
  departurePoint: string;
  arrivalPoint: string;
  departureDate: string;
  arrivalDate: string;
  numberOfKilos: number;
  price: number;
  currency: string;
  goods: string[];
  timestamp: Timestamp;
  status: string;
  bookingDetails: string;
  paid?: boolean;
  retrieved?: boolean;
};

export const MyBalance: React.FC = (): JSX.Element => {
  let { user } = useAuthContext();
  const [transportedPackages, settransportedPackages] = useState<Package[]>([]);
  const [sentPackages, setsentPackages] = useState<Package[]>([]);
  const [expanded, setexpanded] = useState<string | false>(false);

  useEffect(() => {
    const transportedQuery = query(
      collection(db, "bookings"),
      where("offerUserId", "==", user?.id),
      where("paid", "==", true),
      orderBy("timestamp", "desc")
    );

    const sentQuery = query(
      collection(db, "bookings"),
      where("uid", "==", user?.id),
      where("status", "not-in", ["pending", "accepted"]),
      orderBy("status"),
      orderBy("timestamp", "desc")
    );
    const transportedunsubscribe = onSnapshot(
      transportedQuery,
      { includeMetadataChanges: true },
      (QuerySnapshot) => {
        const packages: Package[] = [];
        QuerySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === true) return;
          const data = doc.data();
          packages.push({
            id: doc.id,
            departurePoint: data.departurePoint,
            departureDate: data.departureDate,
            arrivalPoint: data.arrivalPoint,
            arrivalDate: data.arrivalDate,
            numberOfKilos: data.numberOfKilos,
            price: data.price,
            currency: data.currency,
            goods: data.goods,
            status: data.status,
            bookingDetails: data.bookingDetails,
            paid: data.paid,
            retrieved: data.retrieved,
            timestamp: data.timestamp,
            // ...doc.data(),
          });
        });
        settransportedPackages(packages);
      },
      (error) => {
        console.log(error.message);
      }
    );

    const sentunsubscribe = onSnapshot(
      sentQuery,
      { includeMetadataChanges: true },
      (QuerySnapshot) => {
        const packages: Package[] = [];
        QuerySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === true) return;
          const data = doc.data();
          packages.push({
            id: doc.id,
            departurePoint: data.departurePoint,
            departureDate: data.departureDate,
            arrivalPoint: data.arrivalPoint,
            arrivalDate: data.arrivalDate,
            numberOfKilos: data.numberOfKilos,
            price: data.price,
            currency: data.currency,
            goods: data.goods,
            status: data.status,
            bookingDetails: data.bookingDetails,
            paid: data.paid,
            timestamp: data.timestamp,
            // ...doc.data(),
          });
        });
        setsentPackages(packages);
      },
      (error) => {
        alert(error.message);
      }
    );

    return () => {
      transportedunsubscribe();
      sentunsubscribe();
    };
  }, []);

  return (
    <div className="container myBalance">
      <ToastContainer />
      <h2>Incomes</h2>
      {transportedPackages.length > 0 ? (
        <>
          <h3>
            Total{" "}
            {transportedPackages.reduce((total, package_) => {
              return (
                total + Number(package_.numberOfKilos) * Number(package_.price)
              );
            }, 0)}
            {" F (Fcfa)"}
          </h3>
          {transportedPackages.map((package_) => {
            return (
              <Transaction
                key={package_.id}
                package_={package_}
                expanded={expanded === package_.id}
                setexpanded={setexpanded}
                style={{
                  "--animationOrder": transportedPackages.indexOf(package_),
                }}
              />
            );
          })}
        </>
      ) : (
        <div className="nodatasinfos">No Transaction Completed Yet</div>
      )}
    </div>
  );
};

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
  style: object;
};

const Transaction = (props: TransactionProps) => {
  const { package_, expanded, setexpanded, style } = props;
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
      <Accordion
        className="transaction"
        expanded={expanded as boolean}
        onChange={handleChange(package_.id)}
        style={style}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel-content"
        >
          <div className="panel-header">
            <Typography className="text">
              {package_.numberOfKilos} Kg
            </Typography>
            <Typography className="text">
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
      </Accordion>
      {openDialog && (
        <ConfirmationBox
          title="Money Withdrawall"
          confirmKeyword={false}
          handleConfirmation={withdraw}
          open={openDialog}
          setopen={setopenDialog}
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
              <div className="card-logo-wrapper">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  alt="visa-logo"
                  className="card-logo"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg"
                  alt="mastercard-logo"
                  className="card-logo"
                />
              </div>

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
            <form onSubmit={handlePaypalSubmit} className="paypalPaymentForm">
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
              <input
                type="submit"
                value={`Get Paid  ${
                  Number(package_.numberOfKilos) * package_.price
                } ${package_.currency}`}
              />
            </form>
          )}
        </ConfirmationBox>
      )}
    </>
  );
};

import "./PayBooking.css";
import DebitCard from "../../img/debit-cards.png";
import MobileMoney from "../../img/wallet.png";
import { useNavigate, useParams } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useState } from "react";
import { TextField } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { DatePicker } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { useEffect } from "react";
import { addDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../../components/utils/firebase";
import { DateTime } from "luxon";
import {
  updateDoc,
  collection,
  serverTimestamp,
  query,
  getDocs,
  where,
} from "firebase/firestore";
import { useAuthContext } from "../../components/auth/Auth";
import ConfirmationBox from "../../components/ConfirmationBox";

const PayBooking = (props) => {
  let { bookingId } = useParams();
  const [paymentMethod, setpaymentMethod] = useState("card");
  const [cardDatas, setcardDatas] = useState({});
  const [paypalDatas, setpaypalDatas] = useState({});
  const [booking, setbooking] = useState({});
  const [offer, setoffer] = useState({});
  const user = useAuthContext();
  const { setshowLoader } = props;
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handlePaymentMethodChange = (e) => {
    setpaymentMethod(e.target.value);
  };

  const handleCardInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setcardDatas({ ...cardDatas, [name]: value });
  };

  const handlePaypalInputChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    setpaypalDatas({ ...paypalDatas, [name]: value });
  };

  async function handlePaypalSubmit(e) {
    setshowLoader(true);
    e.preventDefault();
    try {
      const ispaymentOk = await processPayment(paypalDatas);
      if (ispaymentOk) {
        await updateDatabase();
        return;
      }
    } catch (e) {
      setshowLoader(false);
      throw new Error(e.message);
    }
    e.target.reset();
    setpaypalDatas({});
    setshowLoader(false);
  }

  async function handleCardSubmit(e) {
    setshowLoader(true);
    // e.preventDefault();
    try {
      const ispaymentOk = await processPayment(cardDatas);
      if (ispaymentOk) {
        await updateDatabase();
        setshowLoader(false);
        return navigate("/mypackages");
      }
    } catch (e) {
      setshowLoader(false);
      throw new Error(e.message);
    }
    e.target.reset();
    setcardDatas({});
    setshowLoader(false);
  }

  async function processPayment(paymentDatas) {
    console.log(paymentDatas);
    setTimeout(() => {}, 5000);
    return true;
  }

  function generateOTP() {
    let digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
  }

  async function updateBooking(id) {
    const bookingRef = doc(db, "bookings", id);
    try {
      await updateDoc(bookingRef, {
        status: "prepaid",
        deliveryotp: generateOTP(),
      });
    } catch (e) {
      throw new Error(e.message);
    }

    return;
  }

  async function updateChatroom(users) {
    let alreadyExist = false;
    try {
      // check if chATROOM of both users already exist
      const chatquery = query(
        collection(db, "chatrooms"),
        where("users", "array-contains", users[0])
      );
      const chatquerySnapshot = await getDocs(chatquery);
      chatquerySnapshot.forEach((doc) => {
        if (doc.data().users.includes(users[1])) {
          alreadyExist = true;
          return;
        }
      });
      if (alreadyExist) return;

      await addDoc(collection(db, "chatrooms"), {
        users: [...users],
        timestamp: serverTimestamp(),
      });
    } catch (e) {
      throw new Error(e.message);
    }
    return;
  }

  const updateDatabase = async () => {
    try {
      await Promise.all([
        updateBooking(bookingId),
        updateChatroom([user.id, offer.uid]),
      ]);
    } catch (e) {
      throw new Error(e.message);
    }
  };

  useEffect(() => {
    async function getDatas() {
      let booking = await getBooking(bookingId);
      let offer = await getOffer(booking.offerId);
      return { booking, offer };
    }

    async function getBooking(id) {
      const docRef = doc(db, "bookings", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      alert("No such document");
    }

    async function getOffer(id) {
      const docRef = doc(db, "offers", id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();
      }
      alert("No such document");
    }

    getDatas().then((datas) => {
      setbooking(datas.booking);
      setoffer(datas.offer);
    });

    return () => {};
  }, []);

  return (
    <div className="container payBooking">
      <div className="payment-recap">
        <h2>prepayment recap</h2>
        <div className="grid-wrapper">
          <div className="title">departure point </div>
          <div>{offer?.departurePoint}</div>
          <div className="title">arrival point</div>
          <div>{offer?.arrivalPoint}</div>
          <div className="title">departure date</div>
          <div>
            {DateTime.fromISO(offer?.departureDate).toLocaleString(
              DateTime.DATE_MED
            )}
          </div>
          <div className="title">arrival date</div>
          <div>
            {DateTime.fromISO(offer?.arrivalDate).toLocaleString(
              DateTime.DATE_MED
            )}
          </div>
          <div className="title">number of kilos</div>
          <div>{booking?.numberOfKilos}</div>
          <div className="title">price/kg</div>
          <div>
            {booking?.price}
            {booking?.currency}
          </div>
          <div>
            <div className="title">goods</div>
            <ul>
              {booking?.goods?.map((good) => {
                return <li key={booking?.goods?.indexOf(good)}>{good}</li>;
              })}
            </ul>
            <div className="title details">Details</div>
            <div>{booking?.bookingDetails}</div>
          </div>
          <div>
            <div className="title">total :</div>
            <div>
              {booking.numberOfKilos &&
                Number(booking.numberOfKilos) * Number(booking.price)}
              {booking?.currency}
            </div>
          </div>
        </div>
      </div>
      <div>
        <FormControl>
          <FormLabel id="payment-method-group-label">
            How would you like to pay please ?
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
                <div className="payment-label">
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
                <div className="payment-label">
                  <span>Mobile Money</span>
                  <img className="payment-logo" src={MobileMoney} alt="" />
                </div>
              }
            />
          </RadioGroup>
        </FormControl>

        {paymentMethod === "card" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setOpenDialog(true);
            }}
            className="cardPaymentForm"
          >
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
            <input
              type="submit"
              value={
                booking.numberOfKilos
                  ? `prepay  ${booking.numberOfKilos * booking.price} ${
                      booking.currency
                    }`
                  : `prepay`
              }
            />
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
              value={
                booking.numberOfKilos
                  ? `prepay  ${booking.numberOfKilos * booking.price} ${
                      booking.currency
                    }`
                  : `prepay`
              }
            />
          </form>
        )}

        {openDialog && (
          <ConfirmationBox
            title="Confirm Booking Prepayment"
            description="A delivery code will be generated right after the payment.
            Please communicate this code to the recipient of your package only after delivery has been made."
            confirmKeyword={false}
            handleConfirmation={handleCardSubmit}
            open={openDialog}
            setopen={setOpenDialog}
          />
        )}
      </div>
    </div>
  );
};

export default PayBooking;

import "../styles/PayBooking.css";
import DebitCard from "../img/debit-cards.png";
import MobileMoney from "../img/wallet.png";
import { useParams } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

const PayBooking = () => {
  let { bookingId } = useParams();
  console.log(bookingId);
  const handlePaymentChoice = (e) => {
    if (document.querySelector(".selected")) {
      document.querySelector(".selected").classList.remove("selected");
    }
    e.target.classList.add("selected");
    return;
  };
  return (
    <div className="container payBooking">
      <FormControl>
        <FormLabel id="payment-method-group-label">
          How would you like to pay please ?
        </FormLabel>
        <RadioGroup
          aria-labelledby="payment-method-group-label"
          defaultValue="card"
          name="radio-buttons-group"
          row
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
          <FormControlLabel value="paypal" control={<Radio />} label="Paypal" />
          <FormControlLabel
            value="Mobile Money"
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
      {/* <div className="payment-methods">
        <h2>How would you like to pay please ?</h2>
        <div className="payment-logos">
          <img onClick={handlePaymentChoice} src={Mastercard} alt="" />
          <img onClick={handlePaymentChoice} src={Visa} alt="" />
          <img onClick={handlePaymentChoice} src={Paypal} alt="" />
          <img onClick={handlePaymentChoice} src={OrangeMoney} alt="" />
          <img onClick={handlePaymentChoice} src={Momo} alt="" />
        </div>
      </div>
      <div className="card"></div>
      <div className="paypal"></div>
      <div className="mobile-money"></div> */}
    </div>
  );
};

export default PayBooking;

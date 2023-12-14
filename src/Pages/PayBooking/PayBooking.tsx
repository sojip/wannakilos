import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useState, useRef, useEffect } from "react";
import { useAuthContext } from "components/auth/useAuthContext";
import ConfirmationBox from "../../components/ConfirmationBox";
import { Content } from "components/DashboardContent";
import {
  Offer,
  Booking,
  FormDatas,
  PayBookingProps,
  PaymentMethod,
} from "./type";
import {
  getBooking,
  getOffer,
  submitCard,
  submitMobileMoney,
  submitPaypal,
  updateDatabase,
} from "./utils";
import { CardPayment } from "./CardPayment";
import { PaypalPayment } from "./PaypalPayment";
import { MobileMoneyPayment } from "./MobileMoneyPayment";
import { Button } from "components/Button";
import { Recap } from "./Recap";
import { Form, Wrapper, PaymentLabel, Img } from "./style";
import DebitCard from "../../img/debit-cards.png";
import MobileMoney from "../../img/wallet.png";

const PayBooking = (props: PayBookingProps) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { bookingId } = useParams();
  const { setshowLoader } = props;
  const [paymentMethod, setpaymentMethod] = useState<PaymentMethod>("card");
  const [data, setData] = useState<FormDatas>({
    card: {
      cardNumber: "",
      cvv: "",
      expirationDate: null,
    },
    paypal: {
      firstName: "",
      lastName: "",
      email: "",
    },
    mobileMoney: "",
  });
  const [booking, setBooking] = useState<Booking | null>(null);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const ref = useRef<HTMLFormElement | null>(null);

  const handlePaymentMethodChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let value = e.target.value;
    setpaymentMethod(value as PaymentMethod);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    let name = e.target.name;
    let value = e.target.value;
    switch (paymentMethod) {
      case "card":
        setData({
          ...data,
          card: {
            ...data.card,
            [name]: value,
          },
        });
        break;
      case "paypal":
        setData({
          ...data,
          paypal: {
            ...data.paypal,
            [name]: value,
          },
        });
        break;
      case "mobileMoney":
        setData({
          ...data,
          mobileMoney: value,
        });
        break;
    }
  };

  const handleSubmit = async () => {
    if (booking === null) return alert("An error occured");
    const amount = booking?.numberOfKilos * booking?.price;
    switch (paymentMethod) {
      case "card":
        try {
          await submitCard(data.card, amount);
        } catch (e) {
          alert(e);
        }
        break;
      case "paypal":
        try {
          await submitPaypal(data.paypal, amount);
        } catch (e) {
          alert(e);
        }
        break;
      case "mobileMoney":
        try {
          await submitMobileMoney(data.mobileMoney, amount);
        } catch (e) {
          alert(e);
        }
        break;
    }
  };

  useEffect(() => {
    (async () => {
      let booking = await getBooking(bookingId as string);
      let offer = await getOffer(booking?.offerId as string);
      setBooking(booking);
      setOffer(offer);
    })();
    return () => {};
  }, []);

  const askConfirmation = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (ref.current !== null) {
      const form = ref.current;
      const isValid = form.reportValidity();
      if (isValid) setOpenDialog(true);
    }
  };

  const handleConfirmation = async () => {
    setOpenDialog(false);
    setshowLoader(true);
    await handleSubmit();
    await updateDatabase(
      bookingId as string,
      user?.id as string,
      offer?.uid as string
    );
    setshowLoader(false);
    navigate("/mypackages");
  };

  return (
    <Content>
      {offer !== null && booking !== null && (
        <Wrapper>
          <Recap {...booking} {...offer} />
          <Form ref={ref} noValidate onSubmit={askConfirmation}>
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
                    <PaymentLabel>
                      <span>Card</span>
                      <Img src={DebitCard} alt="" />
                    </PaymentLabel>
                  }
                />
                <FormControlLabel
                  value="paypal"
                  control={<Radio />}
                  label="Paypal"
                />
                <FormControlLabel
                  value="mobileMoney"
                  control={<Radio />}
                  label={
                    <PaymentLabel>
                      <span>Mobile Money</span>
                      <Img src={MobileMoney} alt="" />
                    </PaymentLabel>
                  }
                />
              </RadioGroup>
            </FormControl>
            {paymentMethod === "card" && (
              <CardPayment
                data={data}
                setData={setData}
                handleChange={handleChange}
              />
            )}
            {paymentMethod === "paypal" && (
              <PaypalPayment data={data} handleChange={handleChange} />
            )}
            {paymentMethod === "mobileMoney" && (
              <MobileMoneyPayment data={data} handleChange={handleChange} />
            )}
            <Button
              type="submit"
              value={`prepay  ${booking?.numberOfKilos * booking?.price} ${
                booking?.currency
              }`}
            />
          </Form>
        </Wrapper>
      )}

      {openDialog && (
        <ConfirmationBox
          title={`Confirm Prepayment Of ${
            (booking?.price as number) * (booking?.numberOfKilos as number)
          } ${booking?.currency}`}
          description="A delivery code will be generated right after the payment.
            Please communicate this code to the recipient of your package only after delivery has been made."
          confirmKeyword={false}
          handleConfirmation={handleConfirmation}
          open={openDialog}
          setOpen={setOpenDialog}
        />
      )}
    </Content>
  );
};

export default PayBooking;

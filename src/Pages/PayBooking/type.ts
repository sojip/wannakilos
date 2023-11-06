export type PayBookingProps = {
  setshowLoader: React.Dispatch<React.SetStateAction<boolean>>;
};

export type PaymentMethod = "card" | "paypal" | "mobileMoney";

export type Offer = {
  uid: string;
  departureDate: string;
  departurePoint: string;
  arrivalDate: string;
  arrivalPoint: string;
};

export type Booking = {
  numberOfKilos: number;
  price: number;
  currency: string;
  goods: string[];
  bookingDetails: string;
  offerId: string;
};

export type Card = {
  cardNumber: string;
  cvv: string;
  expirationDate: Date | null;
};

export type Paypal = {
  firstName: string;
  lastName: string;
  email: string;
};

export type FormDatas = {
  card: Card;
  paypal: Paypal;
  mobileMoney: string;
};

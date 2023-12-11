export type Offer = {
  id: string;
  uid: string;
  departureDate: string;
  departurePoint: string;
  arrivalDate: string;
  arrivalPoint: string;
  numberOfKilos: number;
  price: number;
  currency: string;
  goods: string[];
};

export type Good = {
  name: string;
  checked: boolean;
};

export type BookingFormDatas = {
  numberOfKilos: string;
  bookingDetails: string;
  goods: Good[];
};

export type Booking = Omit<BookingFormDatas, "goods"> & {
  goods: string[];
};

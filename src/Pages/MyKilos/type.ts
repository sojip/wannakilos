import { Timestamp } from "@firebase/firestore-types";

export type Offer = {
  id: string;
  departurePoint: string;
  arrivalPoint: string;
  departureDate: string;
  arrivalDate: string;
  numberOfKilos: number;
  price: number;
  currency: string;
  goods: string[];
  bookings: string[];
  timestamp: Timestamp;
};

export type Booking = Omit<Offer, "bookings"> & {
  id: string;
  status: string;
  bookingDetails: string;
};

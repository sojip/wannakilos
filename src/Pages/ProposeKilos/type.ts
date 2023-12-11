import { DateTime } from "luxon";

export type Good = {
  name: string;
  checked: boolean;
};
export type Offer = {
  uid: string;
  departurePoint: string;
  departureDate: DateTime | null;
  arrivalPoint: string;
  arrivalDate: DateTime | null;
  numberOfKilos: number;
  price: number;
  currency: string;
  goods: Good[];
};

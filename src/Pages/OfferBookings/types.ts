export type Offer = {
  departurePoint: string;
  arrivalPoint: string;
  departureDate: string;
  arrivalDate: string;
  numberOfKilos: number;
  price: number;
  currency: string;
  goods: string[];
};

export type Booking = {
  id: string;
  uid: string;
  uPhoto?: string;
  uFirstName?: string;
  uLastName?: string;
  numberOfKilos: number;
  price: number;
  currency: string;
  goods: string[];
  status: "pending" | "prepaid" | "accepted" | "delivered";
  bookingDetails: string;
};

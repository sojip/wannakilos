import { Timestamp } from "@firebase/firestore-types";
import { ReactNode } from "react";

export type Package = {
  id: string;
  uid: string;
  type: "sent" | "transported";
  departurePoint: string;
  arrivalPoint: string;
  departureDate: string;
  arrivalDate: string;
  bookingDetails: string;
  numberOfKilos: number;
  price: number;
  currency: string;
  status: "prepaid" | "delivered";
  timestamp: Timestamp;
  deliveryOtp?: string;
  paid?: boolean;
}

export type Dialog = {
  title: string;
  description?: string;
  confirmKeyword: boolean;
  keyword?: string;
  handleConfirmation: () => Promise<void>;
  children?: ReactNode;
};

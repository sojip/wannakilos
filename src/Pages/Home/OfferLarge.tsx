import React from "react";
import { Offer } from "./Announcements";
import { DateTime } from "luxon";

export const OfferLarge = (offer: Offer) => {
  return (
    <div className="homeOffer" id={offer.id}>
      <div className="offerInfos">
        <div>{offer.departurePoint} </div>
        <i className="fa-solid fa-right-long"></i>
        <div>{offer.arrivalPoint}</div>
      </div>
      <div className="offerInfos dates">
        <div>
          <i className="fa-solid fa-plane-departure"></i>
          {DateTime.fromISO(offer.departureDate).toLocaleString(
            DateTime.DATE_MED
          )}
        </div>
        <div>
          {DateTime.fromISO(offer.arrivalDate).toLocaleString(
            DateTime.DATE_MED
          )}
          <i className="fa-solid fa-plane-arrival"></i>
        </div>
      </div>
      <div className="offerInfos">
        <div>{offer.numberOfKilos} Kg</div>
        <div>{`${offer.price}${offer.currency}/Kg`}</div>
      </div>

      <div className="offerInfos infosGoods">
        <div className="label" style={{ textAlign: "left" }}>
          Accepted :
        </div>
        <div>
          <ul style={{ display: "flex", gap: "15px" }}>
            {offer.goods.map((good) => (
              <li key={offer.goods.indexOf(good)}>{good}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

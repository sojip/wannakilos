import React from "react";
import { Offer } from "./SendPackage";
import Airplane from "../../img/airplane-takeoff.png";
import { DateTime } from "luxon";
import { Link } from "react-router-dom";

export const OfferCard = (offer: Offer) => {
  return (
    <div className="userOffer">
      <div className="road">
        <div className="offerDepature">{offer.departurePoint}</div>
        <img src={Airplane} alt="" />
        <div className="offerArrival">{offer.arrivalPoint}</div>
      </div>
      <div className="offer-wrapper">
        <div className="offerNumOfkilos">
          <div>Number of Kilos</div>
          <div>{offer.numberOfKilos}</div>
        </div>
        <div className="offerPrice">
          <div>Price</div>
          <div>
            {offer.price} {offer.currency}/Kg
          </div>
        </div>
        <div className="offerGoods">
          <div className="goodsTitle">Goods accepted</div>
          <ul style={{ listStyleType: "square" }}>
            {offer.goods.map((good) => (
              <li key={offer.goods.indexOf(good)}>{good}</li>
            ))}
          </ul>
        </div>
        <div className="dates">
          <div> Departure date</div>
          <div>
            {DateTime.fromISO(offer.departureDate).toLocaleString(
              DateTime.DATE_MED
            )}
          </div>
          <div> arrival date</div>
          <div>
            {DateTime.fromISO(offer.arrivalDate).toLocaleString(
              DateTime.DATE_MED
            )}
          </div>
        </div>
        <div className="actions">
          <Link to={`/book-offer/${offer.id}`} id="bookOffer">
            Book this offer
          </Link>
        </div>
      </div>
    </div>
  );
};

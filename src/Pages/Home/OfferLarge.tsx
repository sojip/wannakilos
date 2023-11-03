import React from "react";
import { Offer } from "./Announcements";
import { DateTime } from "luxon";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 15px;
  border-radius: 15px;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  margin-bottom: 25px;
  &:first-of-type {
    margin-top: 25px;
  }
  & > :first-child {
    text-transform: capitalize;
  }
  @media screen and (max-width: 768px) {
    &:last-of-type {
      margin-bottom: calc(5vh + 25px);
    }
  }
`;

const Infos = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  position: relative;
`;

const UL = styled.ul`
  display: flex;
  gap: 15px;
  margin-bottom: 0;
  padding: 0;
`;

const LI = styled.li`
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

const Icon = styled.i`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

export const OfferLarge = (offer: Offer) => {
  return (
    <Wrapper>
      <Infos>
        <div>{offer.departurePoint} </div>
        <Icon className="fa-solid fa-right-long"></Icon>
        <div>{offer.arrivalPoint}</div>
      </Infos>
      <Infos>
        <div>
          <i
            className="fa-solid fa-plane-departure"
            style={{ marginRight: "10px" }}
          ></i>
          {DateTime.fromISO(offer.departureDate).toLocaleString(
            DateTime.DATE_MED
          )}
        </div>
        <div>
          {DateTime.fromISO(offer.arrivalDate).toLocaleString(
            DateTime.DATE_MED
          )}
          <i
            className="fa-solid fa-plane-arrival"
            style={{ marginLeft: "10px" }}
          ></i>
        </div>
      </Infos>
      <Infos>
        <div>{offer.numberOfKilos} Kg</div>
        <div>{`${offer.price}${offer.currency}/Kg`}</div>
      </Infos>
      <div>
        <div>Accepted :</div>
        <div>
          <UL>
            {offer.goods.map((good) => (
              <LI key={offer.goods.indexOf(good)}>{good}</LI>
            ))}
          </UL>
        </div>
      </div>
    </Wrapper>
  );
};

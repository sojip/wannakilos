import { useState, useEffect } from "react";
import { db } from "../../components/utils/firebase";
import { collection, query, getDocs, orderBy } from "firebase/firestore";
import React from "react";
import { CardLarge } from "../../components/CardLarge";
import { QuerySnapshot } from "@firebase/firestore-types";
import styled from "styled-components";
import { DateTime } from "luxon";

export interface Offer {
  id: string;
  arrivalDate: string;
  arrivalPoint: string;
  departureDate: string;
  departurePoint: string;
  numberOfKilos: number;
  price: number;
  uid: string;
  goods: string[];
  bookings: string[];
  currency: string;
}

const Wrapper = styled.div`
  width: 80%;
  max-width: 1240px;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 25px;
  @media screen and (max-width: 496px) {
    width: 95%;
  }
  @media screen and (min-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const VideoPlayer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  height: 200px;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
`;

const Title = styled.div`
  font-weight: bold;
`;

const Annoucements = () => {
  const [offers, setoffers] = useState<Offer[]>([]);

  useEffect(() => {
    (async function getOffers(): Promise<void> {
      let data: Offer[] = [];
      const q = query(collection(db, "offers"), orderBy("timestamp", "desc"));
      const querySnapshot: QuerySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        let _doc = doc.data();
        data.push({
          id: doc.id,
          arrivalDate: _doc.arrivalDate,
          arrivalPoint: _doc.arrivalPoint,
          departureDate: _doc.departureDate,
          departurePoint: _doc.departurePoint,
          goods: _doc.goods,
          bookings: _doc.bookings,
          currency: _doc.currency,
          price: _doc.price,
          numberOfKilos: _doc.numberOfKilos,
          uid: _doc.uid,
        });
      });
      return setoffers([...data]);
    })();
    return;
  }, []);

  return (
    <Wrapper>
      <VideoPlayer>Video Container</VideoPlayer>
      <div>
        <Title>Annoucements : {offers.length}</Title>
        <div>
          {offers.length > 0 &&
            offers.map((offer) => {
              return (
                <CardLarge $animationOrder={offers.indexOf(offer)}>
                  <CardLarge.Header
                    value1={offer.departurePoint}
                    value2={offer.arrivalPoint}
                    Icon={<i className="fa-solid fa-right-long"></i>}
                  />
                  <CardLarge.Row
                    value1={
                      <>
                        <i
                          className="fa-solid fa-plane-departure"
                          style={{ marginRight: "10px" }}
                        ></i>
                        {DateTime.fromISO(offer.departureDate).toLocaleString(
                          DateTime.DATE_MED
                        )}
                      </>
                    }
                    value2={
                      <>
                        {DateTime.fromISO(offer.arrivalDate).toLocaleString(
                          DateTime.DATE_MED
                        )}
                        <i
                          className="fa-solid fa-plane-arrival"
                          style={{ marginLeft: "10px" }}
                        ></i>
                      </>
                    }
                  />
                  <CardLarge.Row
                    value1={`${offer.numberOfKilos}kg`}
                    value2={`${offer.price}${offer.currency}/kg`}
                  />
                  <CardLarge.List name={"accepted"} values={offer.goods} />
                </CardLarge>
              );
              // return (
              //   <CardLarge
              //     $animationOrder={offers.indexOf(offer)}
              //     key={offer.id}
              //     header={[offer.departurePoint, offer.arrivalPoint]}
              //     rows={[
              //       [
              //         <>
              //           <i
              //             className="fa-solid fa-plane-departure"
              //             style={{ marginRight: "10px" }}
              //           ></i>
              //           {DateTime.fromISO(offer.departureDate).toLocaleString(
              //             DateTime.DATE_MED
              //           )}
              //         </>,
              // <>
              //   {DateTime.fromISO(offer.arrivalDate).toLocaleString(
              //     DateTime.DATE_MED
              //   )}
              //   <i
              //     className="fa-solid fa-plane-arrival"
              //     style={{ marginLeft: "10px" }}
              //   ></i>
              // </>,
              //       ],
              //       [
              // `${offer.numberOfKilos}kg`,
              // `${offer.price}${offer.currency}/kg`,
              //       ],
              //       ["accepted", [...offer.goods], 1],
              //     ]}
              //   />
              // );
            })}
        </div>
      </div>
    </Wrapper>
  );
};

export default Annoucements;

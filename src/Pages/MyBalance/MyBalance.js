import "./MyBalance.css";
import { useEffect, useState } from "react";
import {
  query,
  collection,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../components/utils/firebase";
import useAuthContext from "../../components/auth/useAuthContext";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { DateTime } from "luxon";

export default function MyBalance() {
  const [transportedPackages, settransportedPackages] = useState([]);
  const [sentPackages, setsentPackages] = useState([]);
  let user = useAuthContext();

  useEffect(() => {
    const transportedQuery = query(
      collection(db, "bookings"),
      where("offerUserId", "==", user.id),
      where("paid", "==", true),
      orderBy("timestamp", "desc")
    );

    const sentQuery = query(
      collection(db, "bookings"),
      where("uid", "==", user.id),
      where("status", "not-in", ["pending", "accepted"]),
      orderBy("status"),
      orderBy("timestamp", "desc")
    );
    const transportedunsubscribe = onSnapshot(
      transportedQuery,
      { includeMetadataChanges: true },
      (QuerySnapshot) => {
        const packages = [];
        QuerySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === true) return;
          packages.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        settransportedPackages(packages);
      },
      (error) => {
        console.log(error.message);
      }
    );

    const sentunsubscribe = onSnapshot(
      sentQuery,
      { includeMetadataChanges: true },
      (QuerySnapshot) => {
        const packages = [];
        QuerySnapshot.forEach((doc) => {
          if (doc.metadata.hasPendingWrites === true) return;
          packages.push({
            id: doc.id,
            ...doc.data(),
          });
        });
        setsentPackages(packages);
      },
      (error) => {
        alert(error.message);
      }
    );

    return () => {
      transportedunsubscribe();
      sentunsubscribe();
    };
  }, []);
  return (
    <div className="container myBalance">
      <h2>Incomes</h2>
      {transportedPackages.length > 0 ? (
        <>
          <h3>
            Total{" "}
            {transportedPackages.reduce((total, package_) => {
              return (
                total + Number(package_.numberOfKilos) * Number(package_.price)
              );
            }, 0)}
            {" F (Fcfa)"}
          </h3>
          {transportedPackages.map((package_) => {
            return <Transaction key={package_.id} package_={package_} />;
          })}
        </>
      ) : (
        <div className="nodatasinfos">No Transaction Completed Yet</div>
      )}
    </div>
  );
}

const Transaction = (props) => {
  const { package_ } = props;
  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <div className="panel-header">
          <Typography>{package_.numberOfKilos} Kg</Typography>
          <Typography>
            {package_.price * Number(package_.numberOfKilos)}
            {package_.currency}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div className="details">
          <Typography className="details-title">details </Typography>
          <Typography>{package_.bookingDetails}</Typography>
          <Typography className="details-title">departure point </Typography>
          <Typography>{package_.departurePoint}</Typography>
          <Typography className="details-title">arrival point </Typography>
          <Typography>{package_.arrivalPoint}</Typography>
          <Typography className="details-title">departure date </Typography>
          <Typography>
            {DateTime.fromISO(package_.departureDate).toLocaleString(
              DateTime.DATE_MED
            )}
          </Typography>
          <Typography className="details-title">arrival date </Typography>
          <Typography>
            {DateTime.fromISO(package_.arrivalDate).toLocaleString(
              DateTime.DATE_MED
            )}
          </Typography>
          <Typography className="details-title">goods delivered</Typography>
          <ul>
            {package_.goods.map((good) => (
              <li key={package_.goods.indexOf(good)}>{good}</li>
            ))}
          </ul>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

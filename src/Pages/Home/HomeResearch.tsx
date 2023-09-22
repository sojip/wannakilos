import "./HomeResearch.css";
import { TextField } from "@mui/material";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import Button from "@mui/material/Button";
import React from "react";

interface Datas {
  departure: string | null;
  arrival: string | null;
  from: string | null;
  to: string | null;
}

const HomeResearch = () => {
  const [datas, setdatas] = useState<Datas>({
    departure: null,
    arrival: null,
    from: null,
    to: null,
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setdatas({ ...datas, [name]: value });
  };
  return (
    <div className="homeResearch">
      <form id="researchForm">
        <div id="inputs-grid-wrapper">
          <TextField
            id="departurePoint"
            label="Departure Point"
            variant="standard"
            required
            onChange={handleInputChange}
            fullWidth
            type="text"
            name="departure"
            margin="normal"
          />

          <TextField
            id="arrivalPoint"
            label="Arrival Point"
            variant="standard"
            required
            onChange={handleInputChange}
            fullWidth
            type="text"
            name="arrival"
            margin="normal"
          />
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <DatePicker
              label="From"
              value={datas.from}
              onChange={(newValue) => {
                console.log(newValue);
                setdatas({ ...datas, from: newValue });
              }}
              renderInput={(params) => (
                <TextField {...params} helperText={"mm/dd/yyyy"} />
              )}
            />
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <DatePicker
              label="To"
              value={datas.to}
              onChange={(newValue) => {
                setdatas({ ...datas, to: newValue });
              }}
              renderInput={(params) => (
                <TextField {...params} helperText={"mm/dd/yyyy"} />
              )}
            />
          </LocalizationProvider>
        </div>
        <Button id="search" variant="outlined">
          Search
        </Button>
      </form>
    </div>
  );
};

export default HomeResearch;

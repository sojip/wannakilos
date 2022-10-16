import "./HomeResearch.css";
import { TextField } from "@mui/material";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import Button from "@mui/material/Button";

const HomeResearch = (props) => {
  const [datas, setdatas] = useState({ from: null, to: null });
  return (
    <div className="homeResearch">
      <form id="researchForm">
        <div id="inputs-grid-wrapper">
          <TextField
            id="departurePoint"
            label="Departure Point"
            variant="standard"
            required
            // onChange={handleInputChange}
            fullWidth
            type="text"
            name="departurepoint"
            margin="normal"
          />

          <TextField
            id="arrivalPoint"
            label="Arrival Point"
            variant="standard"
            required
            // onChange={handleInputChange}
            fullWidth
            type="text"
            name="arrivalpoint"
            margin="normal"
          />
          <LocalizationProvider dateAdapter={AdapterLuxon}>
            <DatePicker
              label="From"
              value={datas.from}
              onChange={(newValue) => {
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

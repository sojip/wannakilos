import { TextField } from "@mui/material";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useState } from "react";
import button from "@mui/material/Button";
import React from "react";
import { DateTime } from "luxon";
import styled from "styled-components";

interface Datas {
  departure: string;
  arrival: string;
  from: DateTime | null;
  to: DateTime | null;
}

const Wrapper = styled.div`
  width: 80%;
  max-width: 1240px;
  border-radius: 10px;
  margin: auto;
  background-color: white;
  padding: 20px;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
  @media screen and (max-width: 496px) {
    width: 95%;
  }
`;

const Button = styled(button)`
  width: 50%;
  display: block !important;
  border: solid 2px black !important;
  font-weight: bold !important;
  font-family: var(--textFont) !important;
  color: black !important;
  margin: 20px auto 0 auto !important;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  column-gap: 25px;
  row-gap: 25px;
  @media screen and (min-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Research = () => {
  const [datas, setdatas] = useState<Datas>({
    departure: "",
    arrival: "",
    from: null,
    to: null,
  });
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const name = e.target.name;
    setdatas({ ...datas, [name]: value });
  };
  return (
    <Wrapper>
      <form>
        <Grid>
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
        </Grid>
        <Button variant="outlined">Search</Button>
      </form>
    </Wrapper>
  );
};

export default Research;

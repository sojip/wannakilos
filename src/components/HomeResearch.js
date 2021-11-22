import "../styles/HomeResearch.css";
import { DatePickerComponent } from "@syncfusion/ej2-react-calendars";
import { TextBoxComponent } from "@syncfusion/ej2-react-inputs";

const HomeResearch = (props) => {
  return (
    <div className="homeResearch">
      <form id="researchForm">
        <div id="researchWrapper">
          <div id="departure">
            <TextBoxComponent
              placeholder="Departure point"
              floatLabelType="Always"
            />
            <label
              htmlFor="departureDate"
              style={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "13px" }}
            >
              Departure date
            </label>

            <div className="dateContainer">
              <DatePickerComponent
                id="departureDate"
                name="departureDate"
                strictMode={true}
                start="Year"
                format="yyyy-MM-dd"
                placeholder="yyyy-mm-dd"
              />
            </div>
          </div>
          <div id="arrival">
            <TextBoxComponent
              placeholder="Arrival point"
              floatLabelType="Always"
            />
            <label
              htmlFor="arrivalDate"
              style={{
                color: "rgba(0, 0, 0, 0.54)",
                fontSize: "13px",
              }}
            >
              Arrival date
            </label>
            <div className="dateContainer">
              <DatePickerComponent
                id="arrivalDate"
                name="departureDate"
                strictMode={true}
                start="Year"
                format="yyyy-MM-dd"
                placeholder="yyyy-mm-dd"
              />
            </div>
          </div>
        </div>
        <div
          style={{
            textAlign: "center",
            marginTop: "35px",
          }}
        >
          <input id="search" type="submit" value="Search" />
        </div>
      </form>
    </div>
  );
};

export default HomeResearch;

import React, { useState, useEffect } from "react";
import Info from "./Info";
import Select from "react-select"; // Component for dropdown
import DatePicker from "react-date-picker";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import "./Main.css";

const reqOptions = {
  // Request options to use for each API request
  method: "GET",
  headers: {
    "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
    "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
    useQueryString: true,
  },
};

const dateToString = (date) => {
  // Function to convert date objects into yyyy-mm-dd string format
  let yyyy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();
  if (mm < 10) {
    mm = "0" + mm;
  }
  if (dd < 10) {
    dd = "0" + dd;
  }
  let fullDate = `${yyyy}-${mm}-${dd}`;
  return fullDate;
};

const BlueSwitch = withStyles({
  // Style MaterialUI Switch Component
  switchBase: {
    color: "white",
    "&$checked": {
      color: "#013d5b",
    },
    "&$checked + $track": {
      backgroundColor: "#013d5b",
    },
  },
  checked: {},
  track: {},
})(Switch);

const BlueButton = withStyles((theme) => ({
  // Style MaterialUI Button Component
  root: {
    color: "white",
    backgroundColor: "#013d5b",
    "&:hover": {
      backgroundColor: "#002a40",
    },
  },
}))(Button);

const Main = () => {
  const [currencies, setCurrencies] = useState([]); // Store options for currency dropdown
  const [currency, setCurrency] = useState("USD"); // Defaulting currency to USD in case user forgets to select
  const [origin, setOrigin] = useState([]); // Store options for origin dropdown
  const [destination, setDestination] = useState([]); // Store options for destination dropdown
  const [airportOrigin, setAirportOrigin] = useState(""); // Store airport chosen from origin dropdown
  const [airportDestination, setAirportDestination] = useState(""); // Store airport chosen from destination dropdown
  const [showRoutes, setShowRoutes] = useState(false); // Boolean to determine if routes are to be displayed
  const [originDate, setOriginDate] = useState(new Date()); // Default option for origin datepicker calendar
  const [destDate, setDestDate] = useState(new Date()); // Default option for destination datepicker calendar
  const [obpDate, setObpDate] = useState(dateToString(new Date())); // Set default outbound partial date to today's date
  const [ibpDate, setIbpDate] = useState(""); // Inbound partial date defaulted to empty string
  const [slider, setSlider] = useState(false); // Slider to choose if round trip or one way
  const [routeResponse, setRouteResponse] = useState({}); // Store API response for finding routes
  const [areRoutes, setAreRoutes] = useState(true); // Boolean to determine if routes exist
  const [sortOption, setSortOption] = useState("lowest"); // Defaulting to sort by lowest price

  useEffect(() => {
    // Send one time API request to fetch all currencies
    const fetchCurrencies = async () => {
      try {
        let response = await fetch(
          "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/reference/v1.0/currencies",
          reqOptions
        );
        response = await response.json();
        const newArray = response.Currencies.map((item) => {
          return { value: item.Code, label: item.Code };
        });
        setCurrencies(newArray);
      } catch (error) {
        console.log(error);
        setCurrencies([{ value: "USD", label: "USD" }]);
      }
    };
    fetchCurrencies();
  }, []);

  const handleChangeOrigin = (inputValue) => {
    // Handler to find origin airports based on user input in dropdown
    const fetchOrigin = async () => {
      try {
        if (inputValue !== "") {
          // API Request made only if user inputted value
          let response = await fetch(
            `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/${currency}/en-US/?` +
              new URLSearchParams({ query: inputValue }),
            reqOptions
          );
          response = await response.json();
          const newArray = response.Places.map((item) => {
            // Extracting Airport ID and Place Name to use for dropdown
            return { value: item.PlaceId, label: item.PlaceName };
          });
          setOrigin(newArray);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrigin();
  };
  const handleChangeDestination = (inputValue) => {
    // Handler to find destination airports based on user input in dropdown
    const fetchDestination = async () => {
      try {
        if (inputValue !== "") {
          let response = await fetch(
            `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/${currency}/en-US/?` +
              new URLSearchParams({ query: inputValue }),
            reqOptions
          );
          response = await response.json();
          const newArray = response.Places.map((item) => {
            return { value: item.PlaceId, label: item.PlaceName };
          });
          setDestination(newArray);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDestination();
  };

  const handleOnClick = () => {
    // Handler for "Find Flight" Button
    const fetchRoute = async () => {
      try {
        let response = await fetch(
          `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/${currency}/en-US/${airportOrigin}/${airportDestination}/${obpDate}/${ibpDate}`,
          reqOptions
        );
        response = await response.json();
        if (response.message || response.errors) {
          // If the API response has a message field, there was an internal server error.
          // If it has an errors field, then something went wrong with the API request itself, so an error is thrown
          throw new Error("No Proper Response");
        }
        setRouteResponse(response);
        setShowRoutes(true);
        if (response.Quotes.length < 1) {
          // If the response returns successfully but there are no quotes, it means no routes have been found
          setAreRoutes(false);
        } else {
          setAreRoutes(true);
        }
      } catch (error) {
        console.log(error);
        setAreRoutes(false);
        setShowRoutes(true);
      }
    };
    fetchRoute();
  };

  const handleOriginDateChange = (returnValue) => {
    // Handler for when user selects a particular date in the calendar
    setOriginDate(returnValue);
    if (returnValue !== null) {
      let fullDate = dateToString(returnValue);
      setObpDate(fullDate);
    } else {
      setObpDate("anytime");
    }
  };

  const handleDestDateChange = (returnValue) => {
    setDestDate(returnValue);
    if (returnValue !== null) {
      let fullDate = dateToString(returnValue);
      setIbpDate(fullDate);
    } else {
      setIbpDate("anytime");
    }
  };

  const handleSlider = () => {
    // Toggle for slider
    setSlider(!slider);
    if (!slider) {
      // If the slider is set to false, it means one way, so no inbound partial date
      setIbpDate("");
    }
  };

  return (
    <>
      <div className="main">
        <div className="container1">
          <div className="dropdownPlace">
            <Select
              options={origin}
              onInputChange={handleChangeOrigin}
              onChange={(inputValue) => setAirportOrigin(inputValue.value)}
              isSearchable={true}
              placeholder="Origin"
              filterOption={""}
            >
              Origin
            </Select>
          </div>
          <div className="dropdownPlace">
            <Select
              options={destination}
              onInputChange={handleChangeDestination}
              onChange={(inputValue) => setAirportDestination(inputValue.value)}
              isSearchable={true}
              placeholder="Destination"
              filterOption={""}
            >
              Destination
            </Select>
          </div>
          <div className="datePicker">
            <label style={{ width: "50px" }}>Outbound Date: </label>
            <DatePicker
              onChange={handleOriginDateChange}
              value={originDate}
              minDate={new Date()}
            ></DatePicker>
          </div>
          {slider ? (
            <div className="datePicker">
              <label style={{ width: "50px" }}>Inbound Date: </label>
              <DatePicker
                value={destDate}
                onChange={handleDestDateChange}
                minDate={new Date()}
              ></DatePicker>
            </div>
          ) : (
            <></>
          )}
        </div>
        <br />
        <div className="container2">
          <div className="switch">
            <FormControlLabel
              control={
                <BlueSwitch
                  checked={slider}
                  onChange={handleSlider}
                  name="slider"
                />
              }
              label="Round Trip?"
            />
          </div>
          <div className="dropdownSecondary">
            <Select
              options={currencies}
              onChange={(inputValue) => setCurrency(inputValue.value)}
              isSearchable={true}
              defaultValue={currency}
              placeholder="Currency"
            ></Select>
          </div>
          <div className="dropdownSecondary">
            <Select
              options={[
                { value: "lowest", label: "Lowest" },
                { value: "highest", label: "Highest" },
              ]}
              onChange={setSortOption}
              isSearchable={false}
              defaultValue={sortOption}
              placeholder="Sort Prices"
            ></Select>
          </div>
          <div style={{ margin: "5px" }}>
            <BlueButton
              color="primary"
              variant="contained"
              onClick={handleOnClick}
            >
              Find Flight
            </BlueButton>
          </div>
        </div>
        <br />
        {showRoutes ? (
          <Info
            route={routeResponse}
            areRoutes={areRoutes}
            sortOption={sortOption}
          ></Info>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default Main;

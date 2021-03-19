import React, { useState, useEffect } from "react";
import Info from "./Info";
import Select from "react-select";
import DatePicker from "react-date-picker";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import "./Main.css";

const reqOptions = {
  method: "GET",
  headers: {
    "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
    "x-rapidapi-host": "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
    useQueryString: true,
  },
};

const BlueSwitch = withStyles({
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
  root: {
    color: "white",
    backgroundColor: "#013d5b",
    "&:hover": {
      backgroundColor: "#002a40",
    },
  },
}))(Button);

const Main = () => {
  const dateToString = (date) => {
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
  const [origin, setOrigin] = useState([]);
  const [destination, setDestination] = useState([]);
  const [airportOrigin, setAirportOrigin] = useState("");
  const [airportDestination, setAirportDestination] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [currencies, setCurrencies] = useState([]);
  const [showRoutes, setShowRoutes] = useState(false);
  const [originDate, setOriginDate] = useState(new Date());
  const [obpDate, setObpDate] = useState(dateToString(new Date()));
  const [ibpDate, setIbpDate] = useState("");
  const [slider, setSlider] = useState(false);
  const [destDate, setDestDate] = useState(new Date());
  const [routeResponse, setRouteResponse] = useState({});
  const [areRoutes, setAreRoutes] = useState(true);
  const [sortOption, setSortOption] = useState("lowest");

  useEffect(() => {
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
    const fetchOrigin = async () => {
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
          setOrigin(newArray);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchOrigin();
  };
  const handleChangeDestination = (inputValue) => {
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
    const fetchRoute = async () => {
      try {
        let response = await fetch(
          `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/${currency}/en-US/${airportOrigin}/${airportDestination}/${obpDate}/${ibpDate}`,
          reqOptions
        );
        response = await response.json();
        //console.log(response);
        if (response.message || response.errors) {
          //console.log("Error was received");
          throw new Error("No Proper Response");
        }
        setRouteResponse(response);
        setShowRoutes(true);
        if (response.Quotes.length < 1) {
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
    setSlider(!slider);
    if (!slider) {
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

import React, { useState, useEffect } from "react";
// import Info from "./Info";
import Select from "react-select";
import DatePicker from "react-date-picker";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import "./Main.css";

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
  const reqOptions = {
    method: "GET",
    headers: {
      "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
      "x-rapidapi-host":
        "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
      useQueryString: true,
    },
  };
  const [origin, setOrigin] = useState([]);
  const [destination, setDestination] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [queryOrigin, setQueryOrigin] = useState("");
  const [queryDestination, setQueryDestination] = useState("");
  const [airportOrigin, setAirportOrigin] = useState("");
  const [airportDestination, setAirportDestination] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [currencies, setCurrencies] = useState([]);
  const [showOrigins, setShowOrigins] = useState(false);
  const [showDestinations, setShowDestinations] = useState(false);
  const [originDate, setOriginDate] = useState(new Date());
  const [obpDate, setObpDate] = useState(dateToString(new Date()));
  const [ibpDate, setIbpDate] = useState("");
  const [slider, setSlider] = useState(false);
  const [destDate, setDestDate] = useState(new Date());

  useEffect(async () => {
    let response = await fetch(
      "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/reference/v1.0/currencies",
      reqOptions
    );
    response = await response.json();
    const newArray = response.Currencies.map((item) => {
      return { value: item.Code, label: item.Code };
    });
    setCurrencies(newArray);
  }, []);

  const handleChangeOrigin = (inputValue) => {
    const fetchOrigin = async () => {
      if (inputValue !== "") {
        setQueryOrigin(inputValue);
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
    };
    fetchOrigin();
  };
  const handleChangeDestination = (inputValue) => {
    const fetchDestination = async () => {
      if (inputValue !== "") {
        setQueryDestination(inputValue);
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
    };
    fetchDestination();
  };

  const handleOnClick = async () => {
    let response = await fetch(
      `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browseroutes/v1.0/US/${currency}/en-US/${airportOrigin}/${airportDestination}/${obpDate}?` +
        new URLSearchParams({
          inboundpartialdate: ibpDate,
        }),
      reqOptions
    );
    response = await response.json();
    console.log(response);
  };

  const handleOriginDateChange = (returnValue) => {
    setOriginDate(returnValue);
    if (returnValue !== null) {
      let fullDate = dateToString(returnValue);
      setObpDate(fullDate);
    }
  };

  const handleDestDateChange = (returnValue) => {
    setDestDate(returnValue);
    if (returnValue !== null) {
      let fullDate = dateToString(returnValue);
      setIbpDate(fullDate);
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
      <div className="container">
        <Select
          options={origin}
          onInputChange={handleChangeOrigin}
          onChange={(inputValue) => setAirportOrigin(inputValue.value)}
          isSearchable={true}
          className="item"
        >
          Origin
        </Select>
        <Select
          options={destination}
          onInputChange={handleChangeDestination}
          onChange={(inputValue) => setAirportDestination(inputValue.value)}
          isSearchable={true}
          className="item"
        >
          Destination
        </Select>
        <Select
          options={currencies}
          onChange={(inputValue) => setCurrency(inputValue.value)}
          isSearchable={false}
          defaultValue={currency}
          className="item"
        ></Select>
      </div>
      <div className="container">
        <DatePicker
          onChange={handleOriginDateChange}
          value={originDate}
          required={true}
        ></DatePicker>
        <FormControlLabel
          control={
            <Switch checked={slider} onChange={handleSlider} name="slider" />
          }
          label="Round Trip?"
        />
        {slider ? (
          <DatePicker
            value={destDate}
            onChange={handleDestDateChange}
          ></DatePicker>
        ) : (
          <></>
        )}
        <button onClick={handleOnClick}>Find Flight</button>
      </div>
    </>
  );
};
//

export default Main;

// {
//   showDestinations ? (
//     destination.map((place, index) => (
//       <p key={index}>
//         {place.PlaceName} {}
//       </p>
//     ))
//   ) : (
//     <></>
//   );
// }

// {
//   showOrigins ? (
//     origin.map((place, index) => (
//       <p key={index}>
//         {place.PlaceName} {}
//       </p>
//     ))
//   ) : (
//     <></>
//   );
// }

/* <form onSubmit={handleSubmit}>
  <label htmlFor="originInput">Leaving From</label>
  <input
    id="originInput"
    value={queryOrigin}
    onChange={handleChangeOrigin}
    required
  />
  <label htmlFor="destinationInput">Arriving To</label>
  <input
    id="originInput"
    value={queryDestination}
    onChange={handleChangeDestination}
    required
  />
  <label htmlFor="currencyInput">Currency</label>
  <input
    id="currencyInput"
    value={currency}
    onChange={handleChangeCurrency}
    required
  />
  <button className="search">Submit</button>
</form>;
{
  showOrigins ? <Info type="origin" places={origin}></Info> : <></>;
}
<br />;
{
  showDestinations ? (
    <Info type="destination" places={destination}></Info>
  ) : (
    <></>
  );
} */

// const handleSubmit = (e) => {
//   e.preventDefault();
//   const fetchPlaces = async () => {
//     const reqOptions = {
//       method: "GET",
//       headers: {
//         "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
//         "x-rapidapi-host":
//           "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
//         useQueryString: true,
//       },
//     };
//     let responseOrigin = await fetch(
//       "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?" +
//         new URLSearchParams({ query: queryOrigin }),
//       reqOptions
//     );
//     let responseDestination = await fetch(
//       "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?" +
//         new URLSearchParams({ query: queryDestination }),
//       reqOptions
//     );
//     responseOrigin = await responseOrigin.json();
//     console.log(responseOrigin);
//     setOrigin(responseOrigin.Places);
//     responseDestination = await responseDestination.json();
//     setDestination(responseDestination.Places);
//   };

//   fetchPlaces();
//   setShowOrigins(true);
//   setShowDestinations(true);
//   setQueryOrigin("");
//   setQueryDestination("");
//   setCurrency("");
// };

import React, { useState } from "react";

const Main = () => {
  const [origin, setOrigin] = useState([]);
  const [destination, setDestination] = useState([]);
  const [queryOrigin, setQueryOrigin] = useState("");
  const [queryDestination, setQueryDestination] = useState("");
  const [showOrigins, setShowOrigins] = useState(false);
  const [showDestinations, setShowDestinations] = useState(false);
  const handleChangeOrigin = (e) => setQueryOrigin(e.target.value);
  const handleChangeDestination = (e) => setQueryDestination(e.target.value);
  const handleSubmit = (e) => {
    e.preventDefault();
    const fetchAPI = async () => {
      const reqOptions = {
        method: "GET",
        headers: {
          "x-rapidapi-key": `${process.env.REACT_APP_API_KEY}`,
          "x-rapidapi-host":
            "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com",
          useQueryString: true,
        },
      };
      let responseOrigin = await fetch(
        "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?" +
          new URLSearchParams({ query: queryOrigin }),
        reqOptions
      );
      let responseDestination = await fetch(
        "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?" +
          new URLSearchParams({ query: queryDestination }),
        reqOptions
      );
      responseOrigin = await responseOrigin.json();
      setOrigin(responseOrigin.Places);
      responseDestination = await responseDestination.json();
      setDestination(responseDestination.Places);
    };
    fetchAPI();
    setShowOrigins(true);
    setShowDestinations(true);
    setQueryOrigin("");
    setQueryDestination("");
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
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
        <button className="search">Submit</button>
      </form>

      {showOrigins ? (
        origin.map((place, index) => (
          <p key={index}>
            {place.PlaceName} {}
          </p>
        ))
      ) : (
        <></>
      )}
      {showDestinations ? (
        destination.map((place, index) => (
          <p key={index}>
            {place.PlaceName} {}
          </p>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

export default Main;

import "./App.css";
import React, { useState, useEffect } from "react";

function App() {
  const [places, setPlaces] = useState([]);
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
    const query = "Stockholm";
    let response = await fetch(
      "https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/autosuggest/v1.0/US/USD/en-US/?" +
        new URLSearchParams({ query: query }),
      reqOptions
    );
    response = await response.json();
    setPlaces(response.Places);
    console.log(response.Places);
  };
  useEffect(fetchAPI, []);
  return (
    <div className="App">
      <h1>Hello world</h1>
      {places.map((place, index) => (
        <p key={index}>{place.PlaceName}</p>
      ))}
    </div>
  );
}

export default App;

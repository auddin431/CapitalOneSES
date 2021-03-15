import React, { useState } from "react";
import styled from "styled-components";
import "./Info.css";

const StyledAirport = styled.div`
  background: ${(props) => (props.isClicked ? "aqua" : "white")};
`;

const Airport = (props) => {
  const [isClicked, setIsClicked] = useState(false);
  const [originId, setOriginId] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const outboundpartialdate = "2021-09-01";
  const inboundpartialdate = "2021-10-01";
  const handleOnClick = () => {
    setIsClicked(!isClicked);
    if (props.type === "origin") {
      setOriginId(props.PlaceId);
    } else {
      setDestinationId(props.PlaceId);
    }
    console.log(originId);
    console.log(destinationId);
  };
  return (
    <StyledAirport onClick={handleOnClick} isClicked={isClicked}>
      <p>{props.PlaceId}</p>
      <p>{props.PlaceName}</p>
      <p>{props.CountryName}</p>
    </StyledAirport>
  );
};

const Info = (props) => {
  return (
    <div>
      {props.places.map((place, index) => {
        return (
          <Airport
            PlaceId={place.PlaceId}
            PlaceName={place.PlaceName}
            CountryName={place.CountryName}
            type={place.type}
          />
        );
      })}
      <button>Submit</button>
    </div>
  );
};

export default Info;

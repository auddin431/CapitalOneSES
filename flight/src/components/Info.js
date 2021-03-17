import React, { useState } from "react";
import styled from "styled-components";
import "./Info.css";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const OutlinedCard = (props) => {
  return (
    <div>
      <Card className="root" variant="outlined">
        <CardContent className={props.className}>
          <Typography className="title" gutterBottom>
            {`${props.originName} to ${props.destinationName}`}
          </Typography>
          <Typography variant="h5" component="h2">
            {props.carrierOutbound}{" "}
            {props.carrierInbound === "" ? (
              <></>
            ) : (
              ` -- ${props.carrierInbound}`
            )}
          </Typography>
          <Typography className="pos">
            {`Departure Date: ${props.departureOutboundDate}`}{" "}
            {props.departureInboundDate !== "" ? (
              ` Arrival Date: ${props.departureInboundDate}`
            ) : (
              <></>
            )}{" "}
            {props.nonStop ? " (Nonstop)" : ""}
          </Typography>
          <Typography variant="body1" component="p">
            {props.currencySymbol + props.price}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

const placeFinder = (arr, id) => {
  let n = arr.length;
  let i = 0;
  for (i = 0; i < n; i++) {
    if (arr[i].PlaceId === id) {
      return i;
    }
  }
  return null;
};

const carrierFinder = (arr, id) => {
  let n = arr.length;
  let i = 0;
  for (i = 0; i < n; i++) {
    if (arr[i].CarrierId === id) {
      return i;
    }
  }
  return null;
};

// const StyledAirport = styled.div`
//   background: ${(props) => (props.isClicked ? "aqua" : "white")};
// `;

// const Airport = (props) => {
//   const [isClicked, setIsClicked] = useState(false);
//   const [originId, setOriginId] = useState("");
//   const [destinationId, setDestinationId] = useState("");
//   const outboundpartialdate = "2021-09-01";
//   const inboundpartialdate = "2021-10-01";
//   const handleOnClick = () => {
//     setIsClicked(!isClicked);
//     if (props.type === "origin") {
//       setOriginId(props.PlaceId);
//     } else {
//       setDestinationId(props.PlaceId);
//     }
//     console.log(originId);
//     console.log(destinationId);
//   };
//   return (
//     <StyledAirport onClick={handleOnClick} isClicked={isClicked}>
//       <p>{props.PlaceId}</p>
//       <p>{props.PlaceName}</p>
//       <p>{props.CountryName}</p>
//     </StyledAirport>
//   );
// };

const Info = (props) => {
  return (
    <>
      {props.route.Quotes.map((quote) => {
        let departureOutboundDate = quote.OutboundLeg.DepartureDate.slice(
          0,
          10
        );
        let originId = quote.OutboundLeg.OriginId;
        let carrierOutboundId = quote.OutboundLeg.CarrierIds[0];
        let destinationId = quote.OutboundLeg.DestinationId;
        let originIndex = placeFinder(props.route.Places, originId);
        let destinationIndex = placeFinder(props.route.Places, destinationId);
        let carrierOutboundIndex = carrierFinder(
          props.route.Carriers,
          carrierOutboundId
        );
        let carrierOutbound = props.route.Carriers[carrierOutboundIndex].Name;
        let carrierInboundId;
        let carrierInboundIndex;
        let carrierInbound;
        let departureInboundDate;
        let originName;
        let destinationName;

        if (props.route.Places[originIndex].Type !== "Station") {
          originName = props.route.Places[originIndex].Name;
        } else {
          originName = props.route.Places[originIndex].CityName;
        }
        if (props.route.Places[destinationIndex].Type !== "Station") {
          destinationName = props.route.Places[destinationIndex].Name;
        } else {
          destinationName = props.route.Places[destinationIndex].CityName;
        }
        if (quote.hasOwnProperty("InboundLeg")) {
          departureInboundDate = quote.InboundLeg.DepartureDate.slice(0, 10);
          carrierInboundId = quote.InboundLeg.CarrierIds[0];
        } else {
          departureInboundDate = "";
          carrierInboundId = null;
        }
        if (carrierInboundId) {
          carrierInboundIndex = carrierFinder(
            props.route.Carriers,
            carrierInboundId
          );
          carrierInbound = props.route.Carriers[carrierInboundIndex].Name;
          if (carrierInbound === carrierOutbound) {
            carrierInbound = "";
          }
        } else {
          carrierInbound = "";
        }

        return (
          <OutlinedCard
            originName={originName} //
            destinationName={destinationName} //
            carrierOutbound={carrierOutbound} //
            carrierInbound={carrierInbound}
            departureOutboundDate={departureOutboundDate} //
            departureInboundDate={departureInboundDate} //
            nonStop={quote.Direct} //
            currencySymbol={props.route.Currencies[0].Symbol} //
            price={quote.MinPrice} //
            className={quote.QuoteId === 1 ? "mini" : ""} //
          />
        );
      })}
    </>
  );
};

export default Info;

/* 
{
    routeResponse.Carriers
    routeResponse.Currencies[0].Symbol
    routeResponse.Places
    routeResponse.Quotes

}
*/

{
  /* <div>
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
</div> */
}

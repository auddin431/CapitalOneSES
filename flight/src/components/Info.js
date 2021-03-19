import React from "react";
import "./Info.css";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

const placeFinder = (arr, id) => {
  // Linear search to find a place given the PlaceId
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
  // Linear search to find a carrier given the CarrierId
  let n = arr.length;
  let i = 0;
  for (i = 0; i < n; i++) {
    if (arr[i].CarrierId === id) {
      return i;
    }
  }
  return null;
};

const OutlinedCard = (props) => {
  // Component to store route information to be displayed
  return (
    <div>
      <Card className="root" variant="outlined">
        <CardContent className={props.className}>
          <Typography className="title" gutterBottom>
            {props.carrierOutbound}{" "}
            {props.carrierInbound === "" ? (
              <></>
            ) : (
              ` -- ${props.carrierInbound}`
            )}
          </Typography>
          <Typography variant="h5" component="h2">
            {`${props.originName} to ${props.destinationName}`}
          </Typography>
          <Typography className="pos">
            {`Departure Outbound Date: ${props.departureOutboundDate}`}{" "}
          </Typography>
          {props.departureInboundDate !== "" ? (
            <Typography className="pos">
              {` Departure Inbound Date: ${props.departureInboundDate}`}
            </Typography>
          ) : (
            <></>
          )}{" "}
          {props.nonStop ? " (Nonstop)" : ""}
          <Typography variant="body1" component="p">
            {props.currencySymbol + props.price}
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
};

const InfoWrapper = (props) => {
  // Component to wrap route information and extract required information from API response
  return (
    <>
      {props.areRoutes ? (
        props.route.Quotes.map((quote) => {
          let departureOutboundDate = quote.OutboundLeg.DepartureDate.slice(
            0,
            10
          ); // Extracting "yyyy-mm-dd" string from the outbound leg
          let originId = quote.OutboundLeg.OriginId;
          let carrierOutboundId = quote.OutboundLeg.CarrierIds[0];
          let destinationId = quote.OutboundLeg.DestinationId;
          let originIndex = placeFinder(props.route.Places, originId); // Linear search to find where the origin is within Places array of response
          let destinationIndex = placeFinder(props.route.Places, destinationId); // Finds destination within Places
          let carrierOutboundIndex = carrierFinder(
            props.route.Carriers,
            carrierOutboundId
          ); // Finds outbound carrier location
          let carrierOutbound = props.route.Carriers[carrierOutboundIndex].Name;
          let carrierInboundId;
          let carrierInboundIndex;
          let carrierInbound;
          let departureInboundDate;
          let originName;
          let destinationName;

          if (props.route.Places[originIndex].Type !== "Station") {
            originName = props.route.Places[originIndex].Name; // If the location is not a station, extract name to be displayed
          } else {
            originName = `${props.route.Places[originIndex].CityName} (${props.route.Places[originIndex].IataCode})`; // If it is a station, use city name and iata code to describe instead
          }
          if (props.route.Places[destinationIndex].Type !== "Station") {
            destinationName = props.route.Places[destinationIndex].Name;
          } else {
            destinationName = `${props.route.Places[destinationIndex].CityName} (${props.route.Places[destinationIndex].IataCode})`;
          }
          if (quote.hasOwnProperty("InboundLeg")) {
            // Extract inbound information if it exists
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
              key={quote.QuoteId}
              originName={originName}
              destinationName={destinationName}
              carrierOutbound={carrierOutbound}
              carrierInbound={carrierInbound}
              departureOutboundDate={departureOutboundDate}
              departureInboundDate={departureInboundDate}
              nonStop={quote.Direct}
              currencySymbol={props.route.Currencies[0].Symbol}
              price={quote.MinPrice}
              className={quote.QuoteId === 1 ? "mini" : ""}
            />
          );
        })
      ) : (
        <Typography variant="h5">No Routes Available</Typography>
      )}
    </>
  );
};

const Info = (props) => {
  let copyResponse = { ...props.route };
  if (props.sortOption.value === "highest") {
    // Implementation of the sort functionality
    // If sort from highest to lowest is selected, the quotes will be in reverse order since the API
    // response is already sorted from lowest to highest
    copyResponse.Quotes = props.route.Quotes.slice(0).reverse();
  }
  return <InfoWrapper areRoutes={props.areRoutes} route={copyResponse} />;
};

export default Info;

import React from "react";
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

const InfoWrapper = (props) => {
  return (
    <>
      {props.areRoutes ? (
        props.route.Quotes.map((quote) => {
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
            originName = `${props.route.Places[originIndex].CityName} (${props.route.Places[originIndex].IataCode})`;
          }
          if (props.route.Places[destinationIndex].Type !== "Station") {
            destinationName = props.route.Places[destinationIndex].Name;
          } else {
            destinationName = `${props.route.Places[destinationIndex].CityName} (${props.route.Places[destinationIndex].IataCode})`;
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
    copyResponse.Quotes = props.route.Quotes.slice(0).reverse();
  }
  return <InfoWrapper areRoutes={props.areRoutes} route={copyResponse} />;
};

export default Info;

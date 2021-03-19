# Flight Finder - Capital One Software Engineering Summit
Flight Finder is a React application that utilizes the SkyScanner API to find the cheapest available plane tickets. The application is hosted on GitHub pages and can be viewed at https://auddin431.github.io/CapitalOneSES/.

## Installation and Usage

To install, clone the repository and execute the following command in the terminal:

`npm install`

In the same directory as the code, create a `.env file` that contains the following information: 

`REACT_APP_API_KEY=<sky-scanner-api-key>` where `<sky-scanner-api-key>` is replaced by a string of your SkyScanner API key.

Finally, execute the command `npm start` in the terminal to run the application on localhost.

## Inputting Origin and Destination

The application works by inputting an origin country/state/city in a dropdown, which will then list a number of airports to choose from. The same applies for the destination. After selecting the origin and destination, the locations are stored in respective state variables.

## Outbound and Inbound Partial Dates

The user has to pick an outbound date from a calendar. The calendar is defaulted to today's date, and if the date is removed, the application will store "anytime" as the outbound date. There is also a slider if the user would like a round trip. If the slider is turned, a calendar input for the inbound partial date will be revealed, and its input will be stored. Like the outbound, if no date is selected or is removed, the application stores "anytime" as the inbound date.

## Currencies

There are 152 currencies fetched by the API and placed into a dropdown for currencies, so the user can select their currency preference for the route information. 

## Sorting Prices

There is an option to choose to sort from lowest to highest prices and vice versa. If nothing is selected, the application will assume that the user wants to sort by lowest to highest.

## Displaying Routes

Next to the sort dropdown is the "Find Flight" button, which if pressed, loads and presents the routes (if any).
The routes themselves contain all pertinent information like origin and destination, carriers, outbound and inbound dates, whether the flight is nonstop or not, and finally, the price of the route. The cheapest route is highlighted in green for the user to see.

import "./App.css";
import React from "react";
import Main from "./components/Main";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Header title="Flight Finder" />
      <Main />
      <Footer title="2021" />
    </div>
  );
}

export default App;

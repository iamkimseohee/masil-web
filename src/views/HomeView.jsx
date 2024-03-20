import React from "react";
import Header from "../components/Header";

import Intro from "../components/Intro";
import Contact from "../components/Contact";

// import Site from "../components/Site";
import Port from "../components/Port";
import Footer from "../components/Footer";

import Service from "../components/Service";

const HomeView = () => {
  return (
    <div>
      <Header />
      <Intro />
      <Service />

      <Port />
      <Contact />
      <Footer />
    </div>
  );
};

export default HomeView;

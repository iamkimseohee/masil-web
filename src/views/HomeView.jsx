import React, { useEffect } from "react";
import Header from "../components/Header";

import Intro from "../components/Intro";
import Contact from "../components/Contact";
import Port from "../components/Port";
import Footer from "../components/Footer";

import Service from "../components/Service";
import { useLocation, useNavigate } from "react-router-dom";
import { click } from "@testing-library/user-event/dist/click";

const HomeView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const clicked = new URLSearchParams(location.search).get("clicked");

  useEffect(() => {
    if (clicked === "true") {
      console.log("hi");
      // 페이지 이동 후 스크롤 위치 조정
      window.scrollTo({ top: document.getElementById("port").offsetTop });
      navigate({ search: "" });
    }
  }, [clicked, navigate]);
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

import React, { useState, useEffect } from "react";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Workpage from "./Workpage";
// import Notice from "./Notice";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Mailpage from "./Mailpage";
import Maildetail from "./Maildetail";

function Userpage() {
  const [isActive, setIsActive] = useState(true);

  const handleClick = () => {
    setIsActive(!isActive);
  };
  console.log(isActive);

  const scroll = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  const movePage = useNavigate();

  return (
    <div>
      <section id="userpage">
        <div className="userpage__inner">
          <h1 className="userpage__title">마실 관리자</h1>
          <div className="userpage__btn">
            <div className="menu">
              <NavLink to="workpage" onClick={handleClick} className={isActive ? "active" : ""}>
                작업물 리스트 관리
              </NavLink>
            </div>
            <div className="menu">
              <NavLink to="mailpage" onClick={handleClick}>
                문의 관리
              </NavLink>
            </div>
          </div>

          <div className="userpage__body">
            <Routes>
              <Route path="/" element={<Workpage />} />
              <Route path="/workpage" element={<Workpage />}></Route>
              <Route path="/mailpage/*" element={<Mailpage />}></Route>
            </Routes>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Userpage;

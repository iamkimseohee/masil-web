import React, { useState, useEffect } from "react";

import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Workpage from "./Workpage";
// import Notice from "./Notice";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Mailpage from "./Mailpage";
import Maildetail from "./Maildetail";
import Blockmail from "./Blockmail";
import Remail from "./Remail";
import Blockmaildetail from "./Blockmaildetail";
function Userpage() {
  // const [isActive, setIsActive] = useState(true);

  // const handleClick = () => {
  //   setIsActive(!isActive);
  // };
  // console.log(isActive);
  const locatioin = useLocation();
  const scroll = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  const movePage = useNavigate();
  useEffect(() => {
    console.log(locatioin.pathname);
  });

  return (
    <div>
      <section id="userpage">
        <div className="userpage__inner" style={{ border: "1px solid black" }}>
          <h1 className="userpage__title">마실 관리자</h1>
          <div className="userpage__btn">
            <div className="menu">
              <NavLink to="workpage" className={locatioin.pathname === "/userpage" ? "active" : ""}>
                작업물 리스트 관리
              </NavLink>
            </div>
            <div className="menu">
              <NavLink to="mailpage" className={locatioin.pathname.includes("/userpage/maildetail/") || locatioin.pathname.includes("/userpage/remail/") ? "active" : ""}>
                문의 관리
              </NavLink>
            </div>
            <div className="menu">
              <NavLink to="blockmail" className={locatioin.pathname.includes("/userpage/blockmaildetail/") ? "active" : ""}>
                스팸 리스트
              </NavLink>
            </div>
          </div>

          <div className="userpage__body">
            <Routes>
              <Route path="/" element={<Workpage />} />

              <Route path="/workpage" element={<Workpage />}></Route>
              <Route path="/blockmail" element={<Blockmail />}></Route>
              <Route path="/mailpage/*" element={<Mailpage />}></Route>
              <Route path="/maildetail/:id/:index" element={<Maildetail />} />
              <Route path="/blockmaildetail/:id/:index" element={<Blockmaildetail />} />
              <Route path="/remail/:id" element={<Remail />} />
            </Routes>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Userpage;

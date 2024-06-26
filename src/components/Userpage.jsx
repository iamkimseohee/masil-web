import React, { useState, useEffect } from "react";

import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Workpage from "./Workpage";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Mailpage from "./Mailpage";
import Maildetail from "./Maildetail";
import Blockmail from "./Blockmail";
import Remail from "./Remail";
import Blockmaildetail from "./Blockmaildetail";
import home from "../assets/img/home.png";
function Userpage() {
  const locatioin = useLocation();

  const movePage = useNavigate();
  useEffect(() => {
    // console.log(locatioin.pathname);
  });

  return (
    <div>
      <section id="userpage">
        <div className="userpage__inner">
          <h1 className="userpage__title">마실 관리자</h1>
          <button
            className="btnhome"
            onClick={() => {
              movePage("/");
            }}
          >
            <img src={home} alt="" className="homebtn" />
          </button>

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
              <Route path="/remail/:id/:index" element={<Remail />} />
            </Routes>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Userpage;

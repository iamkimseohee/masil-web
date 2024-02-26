import React, { useState } from "react";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Workpage from "./Workpage";
import Notice from "./Notice";
import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

function Userpage() {
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive(!isActive);
  };

  const scroll = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  const movePage = useNavigate();
  // const activeStyle = {
  //   color: "#FFFFFF",
  //   backgroundColor: "#03ACB4",
  // };
  return (
    <div>
      <section id="userpage">
        <div className="userpage__inner">
          <h1 className="userpage__title">마실 관리자</h1>
          <div className="userpage__btn">
            <div className="menu">
              <NavLink onClick={handleClick} to="hello">
                작업물 리스트 관리
              </NavLink>
            </div>
            <div className="menu">
              {/* <NavLink style={({ isActive }) => (isActive ? activeStyle : {})} to="contctnotice"> */}
              <NavLink onClick={handleClick} to="contctnotice">
                문의 관리
              </NavLink>
            </div>
          </div>

          <div className="userpage__body">
            <button
              className="work_plus"
              onClick={() => {
                movePage("/addwork");
              }}
            >
              작업물 추가 +
            </button>
            <Routes>
              <Route path="/hello" element={<Workpage />}></Route>
              <Route path="/contctnotice" element={<Notice />}></Route>
            </Routes>
            <button
              className="work_plus"
              onClick={() => {
                movePage("/addwork");
              }}
            >
              작업물 추가 +
            </button>
          </div>
          <div className="userpage__btn">
            <button className="btn btn_del">삭제</button>
            <button className="btn btn_can">취소</button>
            <button className="btn btn_ok">확인</button>
            <button onClick={scroll} className="page_up">
              ↑
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Userpage;

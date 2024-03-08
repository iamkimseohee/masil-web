import React, { useState } from "react";

const headerNav = [
  {
    title: "마실",
    url: "#intro",
  },
  {
    title: "분야",
    url: "#service",
  },
  {
    title: "작업",
    url: "#port",
  },

  {
    title: "문의",
    url: "#contact",
  },

  {
    title: "↑",
    url: "/",
  },
];

const Header = () => {
  const [show, setshow] = useState(false);
  const toggleMenu = () => {
    setshow(!show);
  };
  return (
    <header id="header" role="banner">
      <div className="header__inner">
        <div className="header__logo"></div>
        <nav className={`header__nav ${show ? "show" : ""}`} aria-label="메인메뉴">
          <ul>
            {headerNav.map((nav, key) => (
              <li key={key}>
                <a href={nav.url}>{nav.title}</a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header__nav__mobile" id="headerToggle" aria-controls="primary-menu" aria-expanded={show ? "true" : "false"} tabIndex="0" onClick={toggleMenu}>
          <div></div>
        </div>
      </div>
    </header>
  );
};

export default Header;

import React, { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

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
    url: "#header", // 맨위로
  },
];
const smoothScroll = (targetId) => {
  const targetElement = document.getElementById(targetId);
  console.log(targetId, targetElement);
  if (targetElement) {
    window.scrollTo({
      top: targetElement.offsetTop,
      behavior: "smooth", // smooth 스크롤 효과 설정
    });
  }
};

const Header = () => {
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const { error } = await supabase.auth.signOut();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // 사용자 정보가 있는 경우
      console.log("현재 로그인한 사용자:", user);
      console.log("사용자 이메일:", user.email);
      console.log("사용자 고유 식별자:", user.id);
      // console.log("사용자 세션 토큰:", user.session.access_token);
    } else {
      // 사용자 정보가 없는 경우 (로그인되지 않은 상태)
      console.log("로그인되지 않은 상태입니다.");
    }
  };
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
                <a
                  href={nav.url}
                  onClick={(e) => {
                    e.preventDefault();
                    smoothScroll(nav.url.substring(1));
                  }}
                >
                  {nav.title}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="header__nav__mobile" id="headerToggle" aria-controls="primary-menu" aria-expanded={show ? "true" : "false"} tabIndex="0" onClick={toggleMenu}>
          <div className="bluecir"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;

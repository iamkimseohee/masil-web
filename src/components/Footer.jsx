import React from "react";
import underLogo from "../assets/img/underlogo.png";
import { useNavigate } from "react-router-dom";
import { BrowserView, MobileView } from "react-device-detect";

const Footer = () => {
  const movePage = useNavigate();
  // const scroll = () => {
  //   window.scroll({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  // };
  const login = () => {
    movePage("/login");
  };
  return (
    <div>
      <section id="footer">
        <div className="footer__inner">
          <div className="footer__text">
            <div className="text">
              <div className="text1">"A friendly and comfortable IT partner to work with"</div>
              <BrowserView>
                <img src={underLogo} alt="under logo" className="underlogo" onClick={login} style={{ cursor: "pointer" }} />
              </BrowserView>
              <MobileView>
                <img src={underLogo} alt="under logo" className="underlogo" />
              </MobileView>

              <div className="text2">
                <a href="mailto:dudan@ma-sil.co.kr">dudan@ma-sil.co.kr</a>&nbsp;/&nbsp;<a href="tel:">FAX. 0504-380-6568</a>
                <br />
              </div>
              <div className="text3">
                경기도 하남시 미사강변한강로 135, 나동 1055호 <br className="br-m" />
                (망월동, 미사강변스카이폴리스)
                <br />
                Copyright ⓒ 2024 MA-SIL Co.Ltd. All Rights Reserved
              </div>
            </div>
          </div>
        </div>
        {/* <button onClick={scroll}>위로 올료</button> */}
      </section>
    </div>
  );
};

export default Footer;

import React from "react";
import about from "../assets/img/logo.png";

import Lottie from "lottie-react";
import introimg from "..//assets/img/introimg.json";

const Intro = () => {
  return (
    <div>
      <section id="intro">
        <div className="intro__inner">
          <img src={about} alt="어바웃" className="intrologo" />
          <div></div>
          <h1 className="intro__title">
            함께 일할 수 있는 <br />
            친근하고 편한 IT 파트너
          </h1>
          <div className="intro__text">
            부담없이 이웃에 놀러 다니는 일을 '마실'이라고 합니다. <br />
            동네 마실 나가듯 편안하게 고객과 소통하며, 최신 기술과 노련함으로 솔루션을 제시하고 문제를 해결합니다. <br />
            막막한 웹/모바일 애플리케이션 개발, 마실과 함께라면 부담없습니다.
          </div>

          <Lottie animationData={introimg} className="intropic"></Lottie>
        </div>
      </section>
    </div>
  );
};

export default Intro;

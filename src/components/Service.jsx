import React from "react";
import aboutservice2 from "../assets/img/serviceimg.json";
import Lottie from "lottie-react";

const Service = () => {
  return (
    <div>
      <section id="service">
        <div className="service__inner">
          <h1 className="service__title">
            마실은
            <br /> 웹, 모바일 응용 프로그램 개발 전문 회사입니다
          </h1>
          <div className="service__text">
            <div className="text">
              부담 없고 편안하지만, 서로를 존중하고 신뢰하며 협력합니다. 신뢰를 바탕으로 간결하고 효율적인 업무를 지향합니다.
              <br /> 디자인부터 개발까지, 마실은 합리적인 업무 결과를 이끌어 냅니다.
            </div>
          </div>
          <Lottie animationData={aboutservice2} className="servicepic"></Lottie>
        </div>
      </section>
    </div>
  );
};

export default Service;

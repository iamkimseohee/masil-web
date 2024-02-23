import React from "react";
import { dummy } from "../movieDummy";

const Port = () => {
  const IMG_BASE_URL = "https://image.tmdb.org/t/p/w1280/";

  return (
    <div>
      <section id="port">
        <div className="port__inner">
          <h1 className="port__title">작업</h1>
          <div className="port__text">마실은 2001년부터 20년 넘게 개발 업무를 진행해온, 작지만 믿을 수 있는 회사입니다.</div>
          <div className="port__wrap">
            {dummy.results.map((item, key) => {
              return (
                <div key={key}>
                  {" "}
                  {/* <h4>{item.title}</h4> */}
                  <img src={IMG_BASE_URL + item.poster_path} alt="영화포스터" />
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Port;

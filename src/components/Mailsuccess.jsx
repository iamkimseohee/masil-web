import React from "react";
import { useNavigate } from "react-router-dom";

function Mailsuccess() {
  const movePage = useNavigate();

  const ok = () => {
    movePage("/");
  };
  return (
    <div>
      <section id="mailsuccess">
        <div className="mailsuccess__inner">
          <h1 className="mailsuccess__title">감사합니다</h1>
          <div className="mailsuccess__text">
            마실에 제안 및 문의 주셔서 감사합니다. <br /> 보내주신 내용은 담당자가 검토하여 필요시 회신 드리도록 하겠습니다.
          </div>
          <button onClick={ok}>확인</button>
        </div>
      </section>
    </div>
  );
}

export default Mailsuccess;

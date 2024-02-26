import React from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

const Loginpage = () => {
  const movePage = useNavigate();
  const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");
  const cancle = () => {
    movePage("/");
  };

  async function signIn() {
    // const { data, error } = await supabase.auth.signInWithOAuth({
    //   provider: "github",
    //   options: {
    //     redirectTo: "https://example.com/welcome",
    //   },
    // });

    const { data, error } = await supabase.auth.signInWithPassword({
      email: "example@email.com",
      password: "example-password",
    });
  }

  return (
    <div>
      <section id="login">
        <div className="login__inner">
          <h1 className="login__title">마실 관리자 로그인</h1>

          <form action="" className="login__text">
            <div className="text">암호</div>
            <input type="password"></input>
            <div className="text">이메일</div>
            <input type="text"></input>
          </form>
          <div className="login__img">
            <button onClick={cancle}>취소</button>
            <button
              onClick={() => {
                movePage("/userpage");
              }}
            >
              확인
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Loginpage;

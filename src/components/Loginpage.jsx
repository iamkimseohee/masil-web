import React, { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
const supabase = createClient(
  "https://qiwrlvedwhommigwrmcz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY"
);
const Loginpage = () => {
  const movePage = useNavigate();
  const cancle = () => {
    movePage("/");
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // 사용자 정보가 있는 경우
      console.log("현재 로그인한 사용자:", user);
    } else {
      // 사용자 정보가 없는 경우 (로그인되지 않은 상태)
      console.log("로그인되지 않은 상태입니다.");
    }
  };

  const signupHandler = async ({ email, password }) => {
    try {
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      console.log("회원가입 성공:", user);
      // 회원가입 후에 필요한 작업 수행해요
    } catch (error) {
      console.error("회원가입 오류:", error.message);
      // 오류 처리
    }
  };

  const signIn = async ({ email, password }) => {
    try {
      const { user, session, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        throw error;
      }
      console.log("로그인 성공:", user);
      // 로그인 후에 필요한 작업 수행
      movePage("/userpage");
    } catch (error) {
      console.error("로그인 오류:", error.message);
      alert("이메일, 비밀번호를 확인 해주세요");
      // 오류 처리
    }
  };

  return (
    <div>
      <section id="login">
        <div className="login__inner">
          <h1 className="login__title">마실 관리자 로그인</h1>

          <form className="login__text">
            <div className="text">이메일</div>
            <input type="text" name="email" {...register("email")} />
            <div className="text">암호</div>
            <input type="password" name="password" {...register("password")} />
            <div className="login__img"></div>
          </form>
          <div className="login__img">
            <button onClick={cancle}>취소</button>
            {/* <button onClick={handleSubmit(signupHandler)}>회원가입</button> */}
            <button onClick={handleSubmit(signIn)}>확인</button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Loginpage;

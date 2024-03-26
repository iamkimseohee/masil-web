import React, { useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { isMobile } from "react-device-detect";
import { createClient } from "@supabase/supabase-js";
import moment from "moment";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import up from "../assets/img/up.png";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

function Remail() {
  const scroll = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };
  const movePage = useNavigate();

  const { id, index } = useParams();
  const [mailDetail, setMailDetail] = useState(null);

  const form = useRef();
  const fetchMailDetail = async (id) => {
    try {
      const { data, error } = await supabase.from("contact").select("*").eq("id", id).single();
      console.log("기존", data);

      console.log("기존", typeof data);
      if (error) {
        throw error;
      }
      setMailDetail(data);
    } catch (error) {
      console.error("Error fetching mail detail:", error.message);
    }
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const sendEmail = (e) => {
    // e.preventDefault();

    emailjs.sendForm("service_c6liqis", "template_fh0vber", form.current, "GtB_fUHRP8BVN2ou8").then(
      () => {
        console.log("SUCCESS!");
      },
      (error) => {
        console.log("FAILED...", error.text);
      }
    );
  };
  useEffect(() => {
    fetchMailDetail(id);
  }, [id]);

  // const onSubmit = async (data) => {
  //   console.log(data);
  //   try {
  //     const now = moment().format("YYYY.MM.DD HH:mm"); //현재 시간
  //     const newData = { ...data, time: now };
  //     console.log(newData);
  //     const { data: responseData, error } = await supabase.from("contact").insert([newData]);
  //     if (error) {
  //       throw error;
  //     }
  //     console.log("Data inserted successfully:", responseData);
  //     if (isMobile) {
  //       movePage("/success");
  //     } else {
  //       alert("감사합니다. 마실에 제안 및 문의 주셔서 감사합니다. 보내주신 내용은 담당자가 검토하여 필요시 회신 드리도록 하겠습니다.");
  //       // window.location.reload(); // 페이지 새로고침
  //     }
  //   } catch (error) {
  //     console.error("Error inserting data:", error.message);
  //   }
  // };
  const [titleLength, setTitleLength] = useState(0);
  const handleTitleChange = (e) => {
    setTitleLength(e.target.value.length);
    console.log(e.target.value.length);
  };
  return (
    <div>
      <div className="remail">
        <form ref={form} onSubmit={handleSubmit(sendEmail)}>
          <div className="titletext">받는 사람</div>
          <div className="mailinfo">
            <input type="text" name="to_name" className="infoname1" value={mailDetail && mailDetail.name} style={{ borderBlockColor: "#e4e6e6" }} readOnly />
            {/* <input type="text" name="to_name" className="infoname1" defaultValue={mailDetail && mailDetail.name} style={{ borderBlockColor: "#e4e6e6" }} {...register("to_name", { required: "이름을 입력하세요" })} /> */}
            {/* {errors.to_name && <p>{errors.to_name.message}</p>} */}
            <input
              type="email"
              name="to_email"
              value={mailDetail && mailDetail.email}
              className="infomail1"
              style={{ borderBlockColor: "#e4e6e6" }}
              readOnly // {...register("to_email", {
              //   required: "이메일을 입력하세요",
              //   pattern: {
              //     value: /\S+@\S+\.\S+/,
              //     message: "이메일 형식에 맞지 않습니다.",
              //   },
              // })}
            />
            {/* {errors.to_email && <p>{errors.to_email.message}</p>} */}
          </div>
          <div className="titletext">보내는 사람</div>
          <div className="mailinfo">
            <input type="text" name="from_name" className="infoname2" style={{ borderBlockColor: "#e4e6e6" }} {...register("from_name", { required: "이름을 입력하세요" })} />
            {errors.from_name && <p style={{ color: "red" }}>{errors.from_name.message}</p>}
            <input type="email" value="master@masil.com" name="from_email" className="infomail2" style={{ borderBlockColor: "#e4e6e6" }} readOnly />
          </div>

          <div className="titletext">참조</div>
          <input type="email" name="to_cc" style={{ borderBlockColor: "#c0c0c0" }} />

          <div className="titletext">제목</div>
          <input type="text" name="to_title" style={{ borderBlockColor: "#c0c0c0" }} {...register("to_title", { required: "제목을 입력하세요" })} />
          {errors.to_title && <p style={{ color: "red" }}>{errors.to_title.message}</p>}
          <div style={{ display: "flex" }}>
            {" "}
            <div className="remailbody">내용</div>
            <div className="remailbody" style={{ marginLeft: "auto" }}>
              {titleLength}/1000
            </div>
          </div>

          <textarea name="message" style={{ borderBlockColor: "#7B8383" }} {...register("message", { required: "내용을 입력하세요" })} onChange={handleTitleChange} maxLength={1000}></textarea>
          {errors.message && <p style={{ color: "red" }}>{errors.message.message}</p>}
        </form>

        <div className="remailbutton">
          {" "}
          <NavLink to={`/userpage/maildetail/${id}/${index}`}>
            <button className="cancle">취소</button>
          </NavLink>
          <button type="submit" onClick={handleSubmit(sendEmail)} className="ok">
            보내기
          </button>
          <button onClick={scroll} className="page_up">
            <img src={up} alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Remail;

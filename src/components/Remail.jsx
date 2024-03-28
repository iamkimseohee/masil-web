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

  const { id, index } = useParams();
  const [mailDetail, setMailDetail] = useState(null);

  const form = useRef();
  const fetchMailDetail = async (id) => {
    try {
      const { data, error } = await supabase.from("contact").select("*").eq("id", id).single();
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
  } = useForm();
  const sendEmail = (e) => {
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

  const [titleLength, setTitleLength] = useState(0);
  const [nameLength, setNameLength] = useState(0);
  const [ccLength, setCcLength] = useState(0);
  console.log(titleLength, nameLength, ccLength);

  const handleCcChange = (e) => {
    setCcLength(e.target.value.length);
    console.log("cc", e.target.value.length);
    if (e.target.value.length > 38) {
      alert("메일 주소는 최대 38자까지 입력 가능합니다.");
    }
  };
  const handleNameChange = (e) => {
    setNameLength(e.target.value.length);
    console.log("name", e.target.value.length);
    if (e.target.value.length > 38) {
      alert("담당자 이름은 최대 38자까지 입력 가능합니다.");
    }
  };

  const handleTitleChange = (e) => {
    setTitleLength(e.target.value.length);
    console.log("title", e.target.value.length);
    if (e.target.value.length > 38) {
      alert("제목은 최대 38자까지 입력 가능합니다.");
    }
  };

  return (
    <div>
      <div className="remail">
        <form ref={form} onSubmit={handleSubmit(sendEmail)}>
          <div className="titletext">받는 사람</div>
          <div className="mailinfo">
            <input type="text" name="to_name" className="infoname1" value={mailDetail && mailDetail.name} style={{ borderBlockColor: "#e4e6e6" }} readOnly />

            <input type="email" name="to_email" value={mailDetail && mailDetail.email} className="infomail1" style={{ borderBlockColor: "#e4e6e6" }} readOnly />
          </div>
          <div className="titletext">보내는 사람</div>
          <div className="mailinfo">
            <input type="text" maxLength={38} name="from_name" className="infoname2" style={{ borderBlockColor: "#e4e6e6" }} {...register("from_name", { required: "이름을 입력하세요" })} onChange={handleNameChange} />
            {errors.from_name && <p style={{ color: "red", marginTop: "5px" }}>{errors.from_name.message}</p>}
            <input type="email" value="master@masil.com" name="from_email" className="infomail2" style={{ borderBlockColor: "#e4e6e6" }} readOnly />
          </div>

          <div className="titletext">참조</div>
          <input type="email" name="to_cc" style={{ borderBlockColor: "#c0c0c0" }} onChange={handleCcChange} />

          <div className="titletext">제목</div>
          <input type="text" name="to_title" maxLength={38} style={{ borderBlockColor: "#c0c0c0" }} {...register("to_title", { required: "제목을 입력하세요" })} onChange={handleTitleChange} />
          {errors.to_title && <p style={{ color: "red", marginTop: "5px" }}>{errors.to_title.message}</p>}
          <div style={{ display: "flex" }}>
            {" "}
            <div className="remailbody">내용</div>
            <div className="remailbody" style={{ marginLeft: "auto" }}></div>
          </div>

          <textarea name="message" style={{ borderBlockColor: "#7B8383" }} {...register("message", { required: "내용을 입력하세요" })}></textarea>
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

import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import upicon from "../assets/img/upicon.png";
import downicon from "../assets/img/downicon.png";
import up from "../assets/img/up.png";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

function Maildetail() {
  const scroll = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };
  const { id, index } = useParams();
  const navigate = useNavigate();
  const [mailDetail, setMailDetail] = useState(null);
  const [prevId, setPrevId] = useState(null);
  const [nextId, setNextId] = useState(null);

  const indexNum = parseInt(index);

  //~ 로그인 되어있는지 확인하기

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // 사용자 정보가 있는 경우
      console.log("사용자 이메일:", user.email);
    } else {
      // 사용자 정보가 없는 경우 (로그인되지 않은 상태)
      console.log("로그인되지 않은 상태입니다.");
      navigate("/login");
    }
  };

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

  const fetchAdjacentIds = async () => {
    try {
      const { data, error } = await supabase.from("contact").select("*").order("id").range(0, 1).gt("id", id).limit(1);
      if (error) {
        throw error;
      }
      setNextId(data[0]);
    } catch (error) {
      console.error("Error fetching next id:", error.message);
    }

    try {
      const { data, error } = await supabase.from("contact").select("*").order("id", { ascending: false }).range(0, 1).lt("id", id).limit(1);
      if (error) {
        throw error;
      }
      setPrevId(data[0]);
    } catch (error) {
      console.error("Error fetching previous id:", error.message);
    }
  };
  const handleDeleteMail = async () => {
    try {
      const { error } = await supabase.from("contact").delete().eq("id", id);
      if (error) {
        throw error;
      }
      navigate("/userpage/mailpage"); // 메일 삭제 후 메일 목록 페이지로 리다이렉트
    } catch (error) {
      console.error("Error deleting mail:", error.message);
    }
  };

  const blockmail = async () => {
    const mail = { maillist: mailDetail.email };

    try {
      // "blockmail" 테이블에 메일 데이터 삽입
      const { data: blockMailResponse, error: blockMailError } = await supabase.from("blockmaillist").insert(mail);
      if (blockMailError) {
        throw blockMailError;
      }
      console.log("Data inserted into blockmaillist successfully:", blockMailResponse);

      // "contact" 테이블에서 현재 선택한 이메일과 관련된 모든 데이터 가져오기
      const { data: contactData, error: contactError } = await supabase.from("contact").select("*").eq("email", mailDetail.email);
      if (contactError) {
        throw contactError;
      }
      console.log("Data retrieved from contact:", contactData);

      // "blockmail" 테이블에 메일 디테일 데이터 삽입
      const { data: blockMailDetailResponse, error: blockMailDetailError } = await supabase.from("blockmail").insert(contactData);

      if (blockMailDetailError) {
        throw blockMailDetailError;
      }
      console.log("Data inserted into blockmail successfully:", blockMailDetailResponse);

      //* "contact" 테이블에서 해당 메일 아이디와 일치하는 데이터 삭제
      const { data: deleteResponse, error: deleteError } = await supabase.from("contact").delete().eq("email", mailDetail.email);
      if (deleteError) {
        throw deleteError;
      }
      console.log("Data deleted from contact successfully:", deleteResponse);
      navigate("/userpage/mailpage"); // 메일 페이지로 리다이렉트
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchMailDetail(id);
    fetchAdjacentIds();
  }, [id]);
  console.log(prevId);

  return (
    <div>
      <div className="maildetail__inner">
        <div className="btnspace">
          <button onClick={handleDeleteMail} className="maildetailbtn maildel">
            삭제
          </button>
          <button className="maildetailbtn mailblock" onClick={blockmail}>
            스팸차단
          </button>
          <NavLink to={`/userpage/remail/${id}/${index}`} className="maildetailbtn mailre">
            답장
          </NavLink>

          <NavLink to="/userpage/mailpage" className="maildetailbtn maillist">
            목록
          </NavLink>
        </div>
        <div className="maildetail__bodytop">
          <div className="maildetail__bodytoplist">
            <div className="mailbodyid">{indexNum}</div>
            <div className="mailbodyname">{mailDetail && mailDetail.name}</div>
            <div className="mailbodyemail">{mailDetail && mailDetail.email}</div>
            <div className="mailbodytime">{mailDetail && mailDetail.time}</div>
          </div>
          <div className="maildetail__bodytitle">{mailDetail && mailDetail.title}</div>
        </div>
        <div className="maildetail__body">{mailDetail && mailDetail.body}</div>
        <div className="btnspace">
          <button onClick={handleDeleteMail} className="maildetailbtn maildel">
            삭제
          </button>
          <button className="maildetailbtn mailblock" onClick={blockmail}>
            스팸차단
          </button>
          <NavLink to={`/userpage/remail/${id}/${index}`} className="maildetailbtn mailre">
            답장
          </NavLink>

          <NavLink to="/userpage/mailpage" className="maildetailbtn maillist">
            목록
          </NavLink>
        </div>
        {prevId && (
          <div className="prevmail">
            <NavLink to={`/userpage/maildetail/${prevId.id}/${indexNum - 1}`} className="prevmail__inner">
              <img src={upicon} alt="" className="icon" />
              <div className="mailid">{indexNum - 1}</div>
              <div className="mailname">{prevId.name}</div>
              <div className="mailtitle">{prevId.title}</div>
              <div className="mailtime">{prevId.time}</div>
            </NavLink>
          </div>
        )}
        {nextId && (
          <div className="nextmail">
            <NavLink to={`/userpage/maildetail/${nextId?.id}/${indexNum + 1}`} className="nextmail__inner">
              <img src={downicon} alt="" className="icon" />
              <div className="mailid">{indexNum + 1}</div>
              <div className="mailname">{nextId.name}</div>
              <div className="mailtitle">{nextId.title}</div>
              <div className="mailtime">{nextId.time}</div>
            </NavLink>
          </div>
        )}
        <button onClick={scroll} className="page_up">
          <img src={up} alt="" />
        </button>
      </div>
    </div>
  );
}

export default Maildetail;

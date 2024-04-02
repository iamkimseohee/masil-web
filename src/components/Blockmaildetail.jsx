import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import upicon from "../assets/img/upicon.png";
import downicon from "../assets/img/downicon.png";
import up from "../assets/img/up.png";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

function Blockmaildetail() {
  const scroll = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };
  const { id, index } = useParams();

  const navigate = useNavigate();
  const [blockMailDetail, setblockMailDetail] = useState(null);
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

  const fetchBlockMailDetail = async (id) => {
    try {
      const { data, error } = await supabase.from("blockmail").select("*").eq("id", id).single();
      if (error) {
        throw error;
      }
      setblockMailDetail(data);
    } catch (error) {
      console.error("Error fetching mail detail:", error.message);
    }
  };

  const fetchAdjacentIds = async () => {
    try {
      const { data, error } = await supabase.from("blockmail").select("*").order("id").range(0, 1).gt("id", id).limit(1);
      if (error) {
        throw error;
      }
      setPrevId(data[0]);
    } catch (error) {
      console.error("Error fetching next id:", error.message);
    }

    try {
      const { data, error } = await supabase.from("blockmail").select("*").order("id", { ascending: false }).range(0, 1).lt("id", id).limit(1);
      if (error) {
        throw error;
      }
      setNextId(data[0]);
    } catch (error) {
      console.error("Error fetching previous id:", error.message);
    }
  };
  const handleDeleteMail = async () => {
    try {
      const { error } = await supabase.from("blockmail").delete().eq("id", id);
      if (error) {
        throw error;
      }
      navigate("/userpage/blockmail"); // 메일 삭제 후 메일 목록 페이지로 리다이렉트
    } catch (error) {
      console.error("Error deleting mail:", error.message);
    }
  };

  const blockCancl = async () => {
    const mail = { maillist: blockMailDetail.email };

    try {
      // "blockmail" 테이블에 메일 데이터 삭제
      const { data: blockMailResponse, error: blockMailError } = await supabase.from("blockmaillist").delete().eq("maillist", mail.maillist); // mail 객체에서 이메일 주소를 가져와서 이를 기준으로 삭제

      if (blockMailError) {
        throw blockMailError;
      }
      console.log("Data inserted into blockmaillist successfully:", blockMailResponse);

      // "blockmail" 테이블에서 현재 선택한 이메일과 관련된 모든 데이터 가져오기
      const { data: blockmailData, error: contactError } = await supabase.from("blockmail").select("*").eq("email", blockMailDetail.email);
      if (contactError) {
        throw contactError;
      }
      console.log("Data retrieved from contact:", blockmailData);

      // "contact" 테이블에 메일 디테일 데이터 삽입
      const { data: blockMailDetailResponse, error: blockMailDetailError } = await supabase.from("contact").insert(blockmailData);
      if (blockMailDetailError) {
        throw blockMailDetailError;
      }
      console.log("Data inserted into blockmail successfully:", blockMailDetailResponse);

      // "blockmail" 테이블에서 해당 메일 아이디와 일치하는 데이터 삭제
      const { data: deleteResponse, error: deleteError } = await supabase.from("blockmail").delete().eq("email", blockMailDetail.email);
      if (deleteError) {
        throw deleteError;
      }
      console.log("Data deleted from contact successfully:", deleteResponse);
      navigate("/userpage/blockmail"); // 메일 페이지로 리다이렉트
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchBlockMailDetail(id);
    fetchAdjacentIds();
  }, [id]);

  return (
    <div>
      <div className="blockmaildetail__inner">
        <div className="blockbtnspace">
          <button onClick={handleDeleteMail} className="blockmaildetailbtn blockmaildel">
            삭제
          </button>
          <button className="blockmaildetailbtn mailblock" onClick={blockCancl}>
            스팸 차단 해제
          </button>

          <NavLink to="/userpage/blockmail" className="blockmaildetailbtn blockmaillist">
            목록
          </NavLink>
        </div>
        <div className="blockmaildetail__bodytop">
          <div className="blockmaildetail__bodytoplist">
            <div className="blockmailbodyid">{indexNum}</div>
            <div className="blockmailbodyname">{blockMailDetail && blockMailDetail.name}</div>
            <div className="blockmailbodyemail">{blockMailDetail && blockMailDetail.email}</div>
            <div className="blockmailbodytime">{blockMailDetail && blockMailDetail.time}</div>
          </div>
          <div className="blockmaildetail__bodytitle">{blockMailDetail && blockMailDetail.title}</div>
        </div>
        <div className="blockmaildetail__body">{blockMailDetail && blockMailDetail.body}</div>
        <div className="blockbtnspace">
          <button onClick={handleDeleteMail} className="blockmaildetailbtn blockmaildel">
            삭제
          </button>
          <button className="blockmaildetailbtn mailblock" onClick={blockCancl}>
            스팸 차단 해제
          </button>

          <NavLink to="/userpage/blockmail" className="blockmaildetailbtn blockmaillist">
            목록
          </NavLink>
        </div>
        {prevId && (
          <div className="blockprevmail">
            <NavLink to={`/userpage/blockmaildetail/${prevId.id}/${indexNum - 1}`} className="prevmail__inner">
              <img src={upicon} alt="" className="icon" />
              <div className="mailid">{indexNum - 1}</div>
              <div className="mailname">{prevId.name}</div>
              <div className="mailtitle">{prevId.title}</div>
              <div className="mailtime">{prevId.time}</div>
            </NavLink>
          </div>
        )}
        {prevId && nextId && <hr className="bar1" />}
        {prevId && !nextId && <hr className="bar2" />}
        {nextId && (
          <div className="nextmail">
            <NavLink to={`/userpage/blockmaildetail/${nextId?.id}/${indexNum + 1}`} className="nextmail__inner">
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

export default Blockmaildetail;

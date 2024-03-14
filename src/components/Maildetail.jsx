import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import upicon from "../assets/img/upicon.png";
import downicon from "../assets/img/downicon.png";

const supabase = createClient(
  "https://qiwrlvedwhommigwrmcz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY"
);

function Maildetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mailDetail, setMailDetail] = useState(null);
  const [prevId, setPrevId] = useState(null);
  const [nextId, setNextId] = useState(null);
  const [spamEmails, setSpamEmails] = useState([]);

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

  const fetchAdjacentIds = async () => {
    try {
      const { data, error } = await supabase.from("contact").select("*").order("id").range(0, 1).gt("id", id).limit(1);
      console.log("다음", typeof data);
      console.log("다음", data[0]);
      if (error) {
        throw error;
      }
      setNextId(data[0]);
    } catch (error) {
      console.error("Error fetching next id:", error.message);
    }

    try {
      const { data, error } = await supabase
        .from("contact")
        .select("*")
        .order("id", { ascending: false })
        .range(0, 1)
        .lt("id", id)
        .limit(1);
      console.log("이전", data[0]);
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

  //버튼을 누르면 mail이 blocklist에 들어간다
  const blockmail = async () => {
    const mail = { maillist: mailDetail.email };

    console.log(mail);
    try {
      const { data: responseData, error } = await supabase.from("blockmaillist").insert(mail);
      if (error) {
        throw error;
      }
      console.log("Data inserted successfully:", responseData);
    } catch (error) {
      console.error("Error inserting data:", error.message);
    }
  };

  useEffect(() => {
    fetchMailDetail(id);
    fetchAdjacentIds();
  }, [id]);

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
          <NavLink to={`/userpage/remail/${id}`} className="maildetailbtn mailre">
            답장
          </NavLink>

          <NavLink to="/userpage/mailpage" className="maildetailbtn maillist">
            목록
          </NavLink>
        </div>
        <div className="maildetail__bodytop">
          <div className="maildetail__bodytoplist">
            <div className="mailbodyid">{mailDetail && mailDetail.id}</div>
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
          <button className="maildetailbtn mailblock">스팸차단</button>
          <button className="maildetailbtn mailre">답장</button>

          <NavLink to="/userpage/mailpage" className="maildetailbtn maillist">
            목록
          </NavLink>
        </div>
        {prevId && (
          <div className="prevmail">
            <NavLink to={`/userpage/maildetail/${prevId.id}`} className="prevmail__inner">
              {/* <div>▲</div> */}
              <img src={upicon} alt="" className="icon" />
              <div className="mailid">{prevId.id}</div>
              <div className="mailname">{prevId.name}</div>
              <div className="mailtitle">{prevId.title}</div>
              <div className="mailtime">{prevId.time}</div>
            </NavLink>
          </div>
        )}
        {nextId && (
          <div className="nextmail">
            <NavLink to={`/userpage/maildetail/${nextId?.id}`} className="nextmail__inner">
              {/* <div>▼</div> */}
              <img src={downicon} alt="" className="icon" />
              <div className="mailid">{nextId.id}</div>
              <div className="mailname">{nextId.name}</div>
              <div className="mailtitle">{nextId.title}</div>
              <div className="mailtime">{nextId.time}</div>
            </NavLink>
          </div>
        )}
      </div>
    </div>
  );
}

export default Maildetail;

import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import about from "../assets/img/logo.png";
import close from "../assets/img/btn-close.png";
import back from "../assets/img/btn-back.png";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

function Workdetail() {
  const [workDetail, setWorkDetail] = useState(null);

  const { id } = useParams();
  const movePage = useNavigate();

  const goPort = () => {
    movePage("/");
    setTimeout(() => {
      window.scrollTo({
        top: 1880,
        behavior: "smooth", // smooth 스크롤 효과 설정
      });
    }, 500);
  };

  useEffect(() => {
    fetchWorkDetail(id);
  }, [id]);

  const fetchWorkDetail = async (id) => {
    try {
      const { data, error } = await supabase.from("work").select("*").eq("id", id).single(); // Fetch only a single record
      if (error) {
        throw error;
      }
      setWorkDetail(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching mail detail:", error.message);
    }
  };

  return (
    <div>
      <section id="workdetail">
        <div className="workdetail__top2">
          <div className="workdetail__top2__inner">
            {" "}
            <img
              src={back}
              alt="뒤로가기"
              onClick={() => {
                movePage(-1);
              }}
              className="backlogo"
            />
            <div className="workdetail__top2__innertext">작업</div>
          </div>
          <hr className="mobilebar" />
        </div>

        <div className="workdetail__inner">
          <div className="workdetail__top">
            {" "}
            <img
              src={about}
              alt="어바웃"
              onClick={() => {
                movePage(-1);
              }}
              className="intrologo"
            />
            <img src={close} alt="취소" onClick={goPort} className="canclebtn" />
          </div>

          <div className="workdetail__title">{workDetail && workDetail.title}</div>
          <div className="workdetail__body">{workDetail && workDetail.body}</div>
          <div className="worketail__icon">
            {workDetail && (
              <>
                {workDetail.code && <div className="workicon">개발</div>}
                {workDetail.design && <div className="workicon">디자인</div>}
              </>
            )}
          </div>
          <div className="workpic">{workDetail && workDetail.fileUrlList && workDetail.fileUrlList.map((url, index) => <img className="pic" key={index} src={url} />)}</div>
          <hr className="bar2" />

          <button
            className="btngolist"
            onClick={() => {
              movePage(-1);
            }}
          >
            목록
          </button>
        </div>
      </section>
    </div>
  );
}

export default Workdetail;

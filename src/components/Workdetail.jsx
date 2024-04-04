import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import about from "../assets/img/logo.png";
import close from "../assets/img/btn-close.png";
import back from "../assets/img/btn-back.png";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

function Workdetail() {
  const [workDetail, setWorkDetail] = useState(null);
  const [bodyImg, setBodyImg] = useState(false);
  const [thumbImg, setThumbImg] = useState(false);
  const [loading, setLoading] = useState(true); // 추가: 데이터 로딩 여부 상태

  const { id } = useParams();
  const movePage = useNavigate();

  const goPort = () => {
    movePage("/?clicked=true");
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

      let hasThumbNail = data && data.thumbNailUrl && data.thumbNailUrl.length > 0;
      let hasFileUrlList = data && data.fileUrlList && data.fileUrlList.length > 0;
      if (hasThumbNail === null) {
        hasThumbNail = false;
      }
      setThumbImg(hasThumbNail);
      setBodyImg(hasFileUrlList);
      console.log(data, hasThumbNail, hasFileUrlList);
      setLoading(false); // 데이터 로딩 완료 후 상태 업데이트
    } catch (error) {
      console.error("Error fetching mail detail:", error.message);
    }
  };
  console.log("🌮", thumbImg, bodyImg);

  return (
    <div>
      <section id="workdetail">
        <div className="workdetail__top2">
          <div className="workdetail__top2__inner">
            <img src={back} alt="뒤로가기" onClick={goPort} className="backlogo" />
            <div className="workdetail__top2__innertext">작업</div>
          </div>
          <hr className="mobilebar" />
        </div>

        <div className="workdetail__inner">
          <div className="workdetail__top">
            {" "}
            <img src={about} alt="어바웃" onClick={goPort} className="intrologo" />
            <img src={close} alt="취소" onClick={goPort} className="canclebtn" />
          </div>

          <div className="workdetail__title">{workDetail && workDetail.title}</div>
          <div className="workdetail__body">{workDetail && workDetail.body}</div>
          <div className="worketail__icon">
            {workDetail && (
              <>
                {workDetail.code && <div className="workicon">개발</div>}
                {workDetail.design && <div className="workicon">디자인</div>}
                {workDetail.video && <div className="workicon">영상</div>}
              </>
            )}
          </div>

          {loading ? (
            <div style={{ height: "500px", display: "flex", justifyContent: "center", alignItems: "center" }}>
              <div style={{ fontSize: "50px", color: "#7b808d" }}>로딩중...</div>
            </div>
          ) : (
            <div>
              <div className="workpic">
                {bodyImg && workDetail.fileUrlList.map((url, index) => <img className="pic" key={index} src={url} />)}
                {thumbImg && !bodyImg ? <img src={workDetail.thumbNailUrl} alt="" className="thumbimg" /> : ""}
                {!thumbImg && !bodyImg ? <img src="https://qiwrlvedwhommigwrmcz.supabase.co/storage/v1/object/public/images/pub/logo-eng.png" alt="" className="thumbimg" /> : ""}
              </div>
              <hr className="bar2" />

              <button className="btngolist" onClick={goPort}>
                목록
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Workdetail;

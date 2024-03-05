import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import about from "../assets/img/logo.png";
import close from "../assets/img/btn-close.png";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

function Workdetail() {
  const [workDetail, setWorkDetail] = useState(null);

  const { id } = useParams();
  const movePage = useNavigate();

  const goHome = () => {
    movePage("/");
  };

  useEffect(() => {
    fetchMailDetail(id);
  }, [id]);

  const fetchMailDetail = async (id) => {
    try {
      const { data, error } = await supabase.from("work").select("*").eq("id", id).single(); // Fetch only a single record
      if (error) {
        throw error;
      }
      setWorkDetail(data);
    } catch (error) {
      console.error("Error fetching mail detail:", error.message);
    }
  };

  return (
    <div>
      <section id="maildetail">
        <div className="maildetail__inner">
          <div className="maildetail__top">
            {" "}
            <img src={about} alt="어바웃" onClick={goHome} className="intrologo" />
            <img src={close} alt="취소" className="canclebtn" />
          </div>
          <hr className="bar1" />
          <div>{workDetail && workDetail.title}</div>
          <div>{workDetail && workDetail.body}</div>
          <div>
            {" "}
            {workDetail && (workDetail.code ? "개발" : "")}
            {workDetail && workDetail.design ? "디자인" : ""}
          </div>
          <div> {workDetail.imageUrl && <img src={workDetail.imageUrl} />}</div>
        </div>
      </section>
    </div>
  );
}

export default Workdetail;

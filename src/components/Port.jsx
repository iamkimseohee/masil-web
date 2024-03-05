import React from "react";
import { createClient } from "@supabase/supabase-js";

import { dummy } from "../movieDummy";
import { useState, useEffect } from "react";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

const Port = () => {
  // const IMG_BASE_URL = "https://image.tmdb.org/t/p/w1280/";
  const [workData, setworkData] = useState([]);
  useEffect(() => {
    fetchWorkData();
  }, []);

  const fetchWorkData = async () => {
    try {
      const { data, error } = await supabase.from("work").select("*");
      if (error) {
        throw error;
      }
      setworkData(data);
    } catch (error) {
      console.error("Error fetching contact data:", error.message);
    }
  };
  return (
    <div>
      <section id="port">
        <div className="port__inner">
          <h1 className="port__title">작업</h1>
          <div className="port__text">마실은 2001년부터 20년 넘게 개발 업무를 진행해온, 작지만 믿을 수 있는 회사입니다.</div>
          <div className="port__wrap">
            {workData.map((work) => (
              <li key={work.id}>
                {/* <input type="checkbox" checked={checkedItems[work.id] || false} onChange={() => handleCheckboxChange(work.id)} /> */}
                <a>
                  Title: {work.title}, Body: {work.body}, {work.code ? "개발" : ""} {work.design ? "디자인" : ""}
                  {/* {work.file && <img src={`images/${work.imageUrl}`} />} */}
                  {work.imageUrl && <img src={work.imageUrl} />}
                  {/* {work.imageUrl && <img src={im} />} */}
                </a>
              </li>
            ))}
            {dummy.results.map((item, key) => {
              return (
                <div key={key}>
                  {" "}
                  {/* <h4>{item.title}</h4> */}
                  {/* <img src={IMG_BASE_URL + item.poster_path} alt="영화포스터" /> */}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Port;

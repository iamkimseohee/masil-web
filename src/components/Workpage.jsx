import React from "react";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import movebtn from "../assets/img/move.png";
import retouch from "../assets/img/retouch.png";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

function Workpage() {
  const [workData, setworkData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const movePage = useNavigate();

  //맨 위로 가기
  const scroll = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

  const goHome2 = () => {
    movePage("/");
  };

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
      console.log(data);
    } catch (error) {
      console.error("Error fetching contact data:", error.message);
    }
  };
  const handleDelete = async () => {
    //체크된 애들만 가져오기
    const idsToDelete = Object.keys(checkedItems).filter((key) => checkedItems[key]);
    if (idsToDelete.length === 0) return;

    try {
      const { error } = await supabase.from("work").delete().in("id", idsToDelete);
      if (error) {
        throw error;
      }
      // 삭제된 항목을 화면에서 업데이트
      // setContactData((prevData) => prevData.filter((item) => !idsToDelete.includes(item.id)));
      setworkData((prevData) => prevData.filter((item) => item.id !== idsToDelete));
      // 체크박스 초기화
      // setCheckedItems({});
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error("Error deleting contact data:", error.message);
    }
  };

  //체크하면 false 안하면 true
  const handleCheckboxChange = (id) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <div className="workpage">
      <button
        className="work_plus"
        onClick={() => {
          movePage("/addwork");
        }}
      >
        작업물 추가 +
      </button>
      <div>
        <ul>
          {workData.map((work) => (
            <li key={work.id}>
              {/* <input type="checkbox" checked={checkedItems[work.id] || false} onChange={() => handleCheckboxChange(work.id)} />
            <div className="workpageimgs">{work && work.fileUrlList && work.fileUrlList.length > 0 && <img className="workpageimg" src={work.fileUrlList[0]} />}</div> */}
              <div className="workpageitem">
                <input type="checkbox" checked={checkedItems[work.id] || false} onChange={() => handleCheckboxChange(work.id)} />
                <img src={movebtn} alt="" className="move-btn" />
                <NavLink to={"/retouchwork/" + work.id}>
                  {" "}
                  <img src={retouch} alt="" className="retouch-btn" />
                </NavLink>

                <div className="workpageimgs">{work && work.fileUrlList && work.fileUrlList.length > 0 && <img className="workpageimg" src={work.fileUrlList[0]} />}</div>
              </div>
              <div className="workpagetitle">{work.title}</div>
              <div className="workpagebody">{work.body}</div>
              {/* {work && <img src={work.fileUrlList[0]} />} */}
              {/* {work && work.fileUrlList && work.fileUrlList.length > 0 && <img src={work.fileUrlList[0]} />} */}
              {/* Title: {work.title}, Body: {work.body}, {work.code ? "개발" : ""} {work.design ? "디자인" : ""} */}
              {/* {work.file && <img src={`images/${work.imageUrl}`} />} */}
              {/* {work.imageUrl && <img src={im} />} */}
            </li>
          ))}
        </ul>
      </div>

      <button
        className="work_plus"
        onClick={() => {
          movePage("/addwork");
        }}
      >
        작업물 추가 +
      </button>
      <hr />
      <div className="workpage__btn">
        <button onClick={handleDelete} className="btn btn_del">
          삭제
        </button>
        <button className="btn btn_can" onClick={goHome2}>
          취소
        </button>
        <button className="btn btn_ok">확인</button>
        <button onClick={scroll} className="page_up">
          ↑
        </button>
      </div>
    </div>
  );
}

export default Workpage;

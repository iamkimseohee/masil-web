import React from "react";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import movebtn from "../assets/img/move.png";
import retouch from "../assets/img/retouch.png";
import { useDrop } from "react-dnd";
import up from "../assets/img/up.png";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

function Workpage() {
  const [workData, setworkData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const movePage = useNavigate();

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
      movePage("/login");
    }
  };

  //맨 위로 가기
  const scroll = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
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

  //~드래그 기능
  const [draggedItemId, setDraggedItemId] = useState(null);

  const handleDragStart = (e, id) => {
    console.log("내가 선택한 id", id);
    // e.dataTransfer.effectAllowed = "move"; // +버튼 생기는거 맞아주기
    setDraggedItemId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropZoneId) => {
    e.preventDefault();

    // 드롭된 요소의 인덱스를 찾습니다.
    const dropIndex = workData.findIndex((work) => work.id === dropZoneId);

    // 드래그된 요소의 인덱스를 찾습니다.
    const draggedIndex = workData.findIndex((work) => work.id === draggedItemId);

    // 드래그된 요소를 배열에서 제거합니다.
    const draggedWork = workData[draggedIndex];
    const newWorkData = workData.filter((_, index) => index !== draggedIndex);

    // 드롭된 위치에 드래그된 요소를 삽입합니다.
    const updatedWorkData = [...newWorkData.slice(0, dropIndex), draggedWork, ...newWorkData.slice(dropIndex)];

    // 변경된 배열을 상태에 설정합니다.
    setworkData(updatedWorkData);
    setDraggedItemId(null);
  };
  console.log(workData);

  //~ supabase로 보내요
  const onSubmit = async () => {
    try {
      // work 테이블의 모든 데이터를 삭제합니다.
      const { data: deleteResponse, error: deleteError } = await supabase.from("work").delete().gt("id", 0);
      console.log(deleteResponse);
      if (deleteError) {
        throw deleteError;
      }
      console.log("Data deleted from work successfully:", deleteResponse);

      // 새로운 데이터 삽입
      const { data, error: insertError } = await supabase.from("work").insert(workData);
      console.log(data);
      if (insertError) {
        throw insertError;
      }
      console.log("New data inserted into work successfully:", data);

      // 삭제 후 추가 작업이 필요한 경우 여기에 추가합니다.
      // window.location.reload();
    } catch (error) {
      console.error("Error updating data:", error.message);
    }
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
          {workData.map((work, index) => (
            <li key={work.id} onDrop={(e) => handleDrop(e, work.id)} onDragOver={handleDragOver}>
              {/* <input type="checkbox" checked={checkedItems[work.id] || false} onChange={() => handleCheckboxChange(work.id)} />
            <div className="workpageimgs">{work && work.fileUrlList && work.fileUrlList.length > 0 && <img className="workpageimg" src={work.fileUrlList[0]} />}</div> */}
              <div className="workpageitem">
                <input type="checkbox" id={`ch-${index}`} style={{ display: "none" }} className="workinput" checked={checkedItems[work.id] || false} onChange={() => handleCheckboxChange(work.id)} />
                <label htmlFor={`ch-${index}`}></label>

                <img src={movebtn} alt="" className="move-btn" onDragStart={(e) => handleDragStart(e, work.id)} />
                <NavLink to={"/retouchwork/" + work.id} draggable="false">
                  {" "}
                  <img src={retouch} alt="" className="retouch-btn" draggable="false" />
                </NavLink>

                <div className="workpageimgs" draggable="false" style={{ backgroundColor: "#F8F8F8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {work && work.fileUrlList && work.fileUrlList.length > 0 ? (
                    <img className="workpageimg" draggable="false" src={work.fileUrlList[0]} />
                  ) : (
                    <img className="workpageimg" style={{ width: "118px", height: "26px" }} src="https://qiwrlvedwhommigwrmcz.supabase.co/storage/v1/object/public/images/pub/logo-eng.png" draggable="false" alt="Placeholder" />
                  )}
                </div>
              </div>
              <div className="workpagetitle">{work.title}</div>
              <div className="workpagebody">{work.body}</div>
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

        <button
          className="btn btn_can"
          onClick={() => {
            movePage("/");
          }}
        >
          취소
        </button>
        <button className="btn btn_ok" onClick={onSubmit}>
          확인
        </button>
        <button onClick={scroll} className="page_up">
          <img src={up} alt="" />
        </button>
      </div>
    </div>
  );
}

export default Workpage;

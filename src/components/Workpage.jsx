import React from "react";
import { createClient } from "@supabase/supabase-js";
import { useState, useEffect } from "react";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

function Workpage() {
  const [workData, setworkData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

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
      <h1>작업물이 보이는 공간입니다</h1>
      <ul>
        {workData.map((work) => (
          <li key={work.id}>
            <input type="checkbox" checked={checkedItems[work.id] || false} onChange={() => handleCheckboxChange(work.id)} />
            <a>
              Title: {work.title}, Body: {work.body}, {work.code ? "개발" : ""} {work.design ? "디자인" : ""}
            </a>
          </li>
        ))}
      </ul>
      <button onClick={handleDelete}>삭제</button>
    </div>
  );
}

export default Workpage;

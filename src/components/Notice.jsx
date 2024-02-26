import React from "react";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
// import { useNavigate } from "react-router-dom";
const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

function Notice() {
  // const movePage = useNavigate();

  const [contactData, setContactData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    fetchContactData();
  }, []);

  const fetchContactData = async () => {
    try {
      const { data, error } = await supabase.from("contact").select("*");
      if (error) {
        throw error;
      }
      setContactData(data);
    } catch (error) {
      console.error("Error fetching contact data:", error.message);
    }
  };

  const handleDelete = async () => {
    //체크된 애들만 가져오기
    const idsToDelete = Object.keys(checkedItems).filter((key) => checkedItems[key]);
    if (idsToDelete.length === 0) return;

    try {
      const { error } = await supabase.from("contact").delete().in("id", idsToDelete);
      if (error) {
        throw error;
      }
      // 삭제된 항목을 화면에서 업데이트
      // setContactData((prevData) => prevData.filter((item) => !idsToDelete.includes(item.id)));
      setContactData((prevData) => prevData.filter((item) => item.id !== idsToDelete));
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
    <div>
      <ul>
        {contactData.map((contact) => (
          <li key={contact.id}>
            <input type="checkbox" checked={checkedItems[contact.id] || false} onChange={() => handleCheckboxChange(contact.id)} />
            <a>
              Name: {contact.name}, Email: {contact.email}, Message: {contact.body} ,Time: {contact.created_at}
            </a>
          </li>
        ))}
      </ul>
      <button onClick={handleDelete}>삭제</button>
      {/* <button
        onClick={() => {
          movePage("/addwork");
        }}
      >
        작업물추가
      </button> */}
    </div>
  );
}

export default Notice;

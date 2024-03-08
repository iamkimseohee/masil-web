import React from "react";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { NavLink, Routes, Route, Link } from "react-router-dom";
import Workpage from "./Workpage";
import Maildetail from "./Maildetail";
import listnum from "../assets/img/btnlistnum.png";
import { useNavigate } from "react-router-dom";
import Userpage from "./Userpage";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

const ITEMS_PER_PAGE = 10;

function Mailpage() {
  const [contactData, setContactData] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 상태 추가
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    fetchContactData();
  }, [currentPage, itemsPerPage]);

  const fetchContactData = async () => {
    try {
      const { data, error } = await supabase
        .from("contact")
        .select("*")
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);
      if (error) {
        throw error;
      }
      setContactData(data);
    } catch (error) {
      console.error("Error fetching contact data:", error.message);
    }
  };

  const handleDelete = async () => {
    const idsToDelete = Object.keys(checkedItems).filter((key) => checkedItems[key]);
    if (idsToDelete.length === 0) return;

    try {
      const { error } = await supabase.from("contact").delete().in("id", idsToDelete);
      if (error) {
        throw error;
      }
      setContactData((prevData) => prevData.filter((item) => !idsToDelete.includes(item.id)));
      setCheckedItems({});
      window.location.reload(); // 페이지 새로고침
      // navigate("/mailpage"); // mailpage로 이동
    } catch (error) {
      console.error("Error deleting contact data:", error.message);
    }
  };

  const handleCheckboxChange = (id) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleSelectAll = () => {
    const newCheckedItems = {};
    if (!selectAll) {
      contactData.forEach((contact) => {
        newCheckedItems[contact.id] = true;
      });
    }
    setCheckedItems(newCheckedItems);
    setSelectAll(!selectAll);
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const [show, setshow] = useState(false);
  const toggleMenu = () => {
    setshow(!show);
    console.log("클릭");
  };

  const handleItemsPerPageChange = (perPage) => {
    setItemsPerPage(perPage);
    setCurrentPage(1); // 페이지를 처음으로 리셋
  };

  return (
    <div>
      <section id="mailpage">
        <div className="mailpage__inner">
          {/* 삭제,스팸차단, 답장 구역 */}
          <div className="btnspace">
            <button onClick={handleDelete} className=" btnlist btndel">
              삭제
            </button>
            <button style={{ marginRight: "916px" }} className="btnlist btnblock">
              스팸차단
            </button>
            <button style={{ marginRight: "60px" }} className=" btnlist btnre">
              답장
            </button>
            <nav className={`header__nav ${show ? "show" : ""}`}>
              <ul>
                <li>
                  <button onClick={() => handleItemsPerPageChange(10)}>목록 개수 10개</button>
                  <button onClick={() => handleItemsPerPageChange(20)}>목록 개수 20개</button>
                  <button onClick={() => handleItemsPerPageChange(30)}>목록 개수 30개</button>
                </li>
              </ul>
            </nav>
            <button aria-expanded={show ? "true" : "false"} className="btnlist btnlistnum" onClick={toggleMenu}>
              <img src={listnum} onClick={toggleMenu} alt="" />
            </button>
          </div>
          {/* //체크박스 번호 담당자이름 */}
          <div className="titlelist">
            <input type="checkbox" name="" id="" className="checkboz" checked={selectAll} onChange={handleSelectAll} />
            <div className="num">번호</div>
            <div className="name">담당자이름</div>
            <div className="title">제목</div>
            <div className="time">날짜 및 시간</div>
          </div>
          {/* 메일리스트 */}
          <div className="maillist">
            <ul>
              {contactData.map((contact) => (
                <li className="maillistli" key={contact.id}>
                  <input type="checkbox" className="checkboxs" checked={checkedItems[contact.id] || false} onChange={() => handleCheckboxChange(contact.id)} />
                  <NavLink to={`/userpage/maildetail/${contact.id}`} className="datalist">
                    <div className="num">{contact.id}</div>
                    <div className="name">{contact.name}</div>
                    <div className="title maintitle">{contact.title}</div>
                    <div className="time">{contact.time}</div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
          {/* <div className="maildetailpage">
            <Routes>
              <Route path="/mailpage/*" element={<Mailpage />} />
              <Route path="/maildetail/:id" element={<Maildetail />} />
            </Routes>
          </div> */}

          {/* 삭제,스팸차단, 답장 구역 */}
          <div className="btnspace">
            <button onClick={handleDelete} className=" btnlist btndel">
              삭제
            </button>
            <button style={{ marginRight: "916px" }} className="btnlist btnblock">
              스팸차단
            </button>
            <button style={{ marginRight: "60px" }} className=" btnlist btnre">
              답장
            </button>
            <button className="btnlist btnlistnum">{/* 아이콘 */}</button>
          </div>
        </div>
        {/* 페이지 옮기는 버튼  */}
        <div>
          <button onClick={prevPage} disabled={currentPage === 1}>
            〈〈
          </button>
          <span>{currentPage}</span>
          <button onClick={nextPage}> 〉〉 </button>
        </div>
      </section>
    </div>
  );
}

export default Mailpage;

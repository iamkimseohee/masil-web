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
  const [checkedItems, setCheckedItems] = useState({});
  const [contactData, setContactData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const [totalItems, setTotalItems] = useState(0); // 데이터의 총 갯수
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 상태 추가
  const [selectedPage, setSelectedPage] = useState(currentPage); // 현재 선택된 페이지를 나타내는 상태 추가
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [pagelist, setpagelist] = useState([]);

  useEffect(() => {
    fetchContactData();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    //~ 데이터의 총 갯수를 가져오는 함수
    const fetchTotalItems = async () => {
      try {
        const { count, error } = await supabase.from("contact").select("id", { count: "exact" });
        // console.log(count);
        if (error) {
          throw error;
        }
        setTotalItems(count);
      } catch (error) {
        console.error("Error fetching total items:", error.message);
      }
    };

    fetchTotalItems();
  }, []);
  // 10,20,30개 선택되면 바꾸기
  const handleItemsPerPageChange = (perPage) => {
    setItemsPerPage(perPage);
    setCurrentPage(1); // 페이지를 처음으로 리셋
  };
  //~ 10,20,30개 나타내기
  const fetchContactData = async () => {
    try {
      const { data, error } = await supabase
        .from("contact")
        .select("*")
        .order("id")
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);
      // console.log(data);
      if (error) {
        throw error;
      }
      setContactData(data);
    } catch (error) {
      console.error("Error fetching contact data:", error.message);
    }
  };

  //~ 페이지 수 계산
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  //~ 처음 페이지에 화면 그리기

  // 페이지 번호 렌더링
  const pageNumbers = []; // 보여줄 페이지 담을 배열
  const maxPagesToShow = 10; // 한 번에 보여줄 최대 페이지 수

  let startPage = Math.max(currentPage - Math.floor(maxPagesToShow / 2), 1); //시작하는 페이지
  console.log("startPage🔥", startPage);

  let endPage = startPage + maxPagesToShow - 1; //마지막 페이지

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(totalPages - maxPagesToShow + 1, 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  console.log(pageNumbers);

  // 페이지 이동 함수
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedPage(pageNumber); // 선택된 페이지 업데이트
    console.log(pageNumber);
  };
  //~ >>버튼기능
  const nextSetPage = () => {
    const newStartPage = endPage + 1;
    const newEndPage = Math.min(newStartPage + maxPagesToShow - 1, totalPages);
    console.log(newStartPage, newEndPage); // >> 버튼 누르면

    if (newStartPage <= totalPages) {
      setCurrentPage(newStartPage);
      setSelectedPage(newStartPage);
    }
  };

  //~ 10,20,30 버튼
  const [show, setshow] = useState(false);
  const toggleMenu = () => {
    setshow(!show);
    console.log("클릭");
  };
  const [show2, setshow2] = useState(false);
  const toggleMenu2 = () => {
    setshow2(!show2);
    console.log("클릭");
  };

  // 처음 페이지로 이동하는 함수
  const goToFirstPage = () => {
    setCurrentPage(1);
    setSelectedPage(1);
  };

  // 마지막 페이지로 이동하는 함수
  const goToLastPage = () => {
    setCurrentPage(totalPages);
    setSelectedPage(totalPages);
  };

  //~ 이전 10개
  const goToPreviousPageSet = () => {
    let newStartPage = Math.max(selectedPage - 10, 1);
    if (selectedPage > 10) {
      let lastDigit = String(selectedPage).slice(-1);

      if (lastDigit == 0) {
        lastDigit = 10;
      }

      newStartPage = Math.max(selectedPage - lastDigit, 1);
    }
    setCurrentPage(newStartPage);
    setSelectedPage(newStartPage);
  };

  //~ 다음 10개
  const goToNextPageSet = () => {
    const lastDigit = String(selectedPage).slice(-1);
    const pnum = 10 - lastDigit;
    console.log(10 - lastDigit);
    const newStartPage = Math.min(selectedPage + pnum + 1, totalPages);

    setCurrentPage(newStartPage);
    setSelectedPage(newStartPage);
  };

  //~ 삭제기능
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

  //~ 체크박스 상태 업데이트
  const handleCheckboxChange = (id) => {
    setCheckedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  //~ 전체선택
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

  return (
    <div>
      <section id="mailpage">
        <div className="mailpage__inner">
          {/* 삭제,스팸차단, 답장 구역 */}
          <div className="btnspace">
            <button onClick={handleDelete} className=" btnlist btndel">
              삭제
            </button>
            <button className="btnlist btnblock">스팸 차단</button>

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

          {/* 삭제,스팸차단, 답장 구역 */}
          <div className="btnspace">
            <button onClick={handleDelete} className=" btnlist btndel">
              삭제
            </button>
            <button className="btnlist btnblock">스팸 차단</button>
            <nav className={`header__nav ${show2 ? "show2" : ""}`}>
              <ul>
                <li>
                  <button onClick={() => handleItemsPerPageChange(10)}>목록 개수 10개</button>
                  <button onClick={() => handleItemsPerPageChange(20)}>목록 개수 20개</button>
                  <button onClick={() => handleItemsPerPageChange(30)}>목록 개수 30개</button>
                </li>
              </ul>
            </nav>
            <button className="btnlist btnlistnum">
              {" "}
              <img src={listnum} onClick={toggleMenu2} alt="" />
            </button>
          </div>
        </div>

        <div className="pagination">
          <button onClick={goToFirstPage}>{"|<"}</button>
          <button onClick={goToPreviousPageSet}>{"<"}</button>
          {pageNumbers.map((pageNumber) => (
            <button key={pageNumber} onClick={() => goToPage(pageNumber)} className={pageNumber === selectedPage ? "selected" : ""}>
              {pageNumber}
            </button>
          ))}
          {currentPage < totalPages && <button onClick={goToNextPageSet}>{">"}</button>}
          <button onClick={goToLastPage}>{">|"}</button>
        </div>
      </section>
    </div>
  );
}

export default Mailpage;

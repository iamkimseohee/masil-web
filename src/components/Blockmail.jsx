import React from "react";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { NavLink, Routes, Route, Link } from "react-router-dom";
import Workpage from "./Workpage";
import Maildetail from "./Maildetail";
import listnum from "../assets/img/btnlistnum.png";
import { useNavigate } from "react-router-dom";
import Userpage from "./Userpage";

const supabase = createClient(
  "https://qiwrlvedwhommigwrmcz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY"
);

const ITEMS_PER_PAGE = 10;

function Blockmail() {
  const [checkedItems, setCheckedItems] = useState({});
  const [contactData, setContactData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const [totalItems, setTotalItems] = useState(0); // 데이터의 총 갯수
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 상태 추가
  const [selectedPage, setSelectedPage] = useState(currentPage); // 현재 선택된 페이지를 나타내는 상태 추가
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [blocklist, setblocklist] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 메일리스트 가져오기
        const { data: blockListData, error: blockListError } = await supabase.from("blockmaillist").select("maillist");
        console.log(blockListData);
        if (blockListError) {
          throw blockListError;
        }

        if (blockListData) {
          // blocklist에서 이메일 주소 배열 가져오기
          const blocklistEmails = blockListData.map((item) => item.maillist);

          // 데이터 가져오기
          const { data: contactData, error: contactError } = await supabase.from("contact").select("*").order("id");
          // .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);

          if (contactError) {
            throw contactError;
          }

          // blocklist에 있는 이메일을 필터링하여 제외
          const filteredData = contactData.filter((contact) => blocklistEmails.includes(contact.email));

          // 상태 업데이트

          setContactData(filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
          // 페이지에 맞게 데이터 슬라이스

          setTotalItems(filteredData.length);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage]);
  console.log(contactData);
  console.log(totalItems);

  // 10,20,30개 선택되면 바꾸기
  const handleItemsPerPageChange = (perPage) => {
    setItemsPerPage(perPage);
    setCurrentPage(1); // 페이지를 처음으로 리셋
  };

  //~ 페이지 수 계산
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  //~ 처음 페이지에 화면 그리기

  // 페이지 번호 렌더링
  const pageNumbers = []; // 보여줄 페이지 담을 배열
  const maxPagesToShow = 10; // 한 번에 보여줄 최대 페이지 수
  let lastnum = String(currentPage).slice(-1);

  console.log(lastnum, currentPage - lastnum + 1);

  console.log(currentPage);
  let startPage = Math.max(currentPage - lastnum + 1, 1); //시작하는 페이지
  if (lastnum == 1) {
    startPage = currentPage;
  }

  console.log("startPage🔥", startPage);

  let endPage = startPage + maxPagesToShow - 1; //마지막 페이지
  console.log("endPage🔥", endPage);
  if (
    lastnum == 0 //< 버튼 눌렀을때
  ) {
    endPage = currentPage;
    startPage = currentPage - 9;
  }

  if (endPage > totalPages) {
    endPage = totalPages;
    // startPage = Math.max(totalPages - maxPagesToShow + 1, 1);
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
    console.log(lastDigit);
    let pnum = 10 - lastDigit;
    if (lastDigit == 0) {
      pnum = 0;
    }
    console.log(10 - lastDigit);
    const newStartPage = Math.min(selectedPage + pnum + 1, totalPages);
    console.log(newStartPage);

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
      <section id="blockmail">
        <div className="blockmail_inner">
          {/* 삭제,스팸차단, 답장 구역 */}
          <div className="btnspace">
            <button onClick={handleDelete} className=" btnlist btndel">
              영구 삭제
            </button>
            <button className="btnlist btnblock">스팸 차단 해제</button>

            <nav className={`header__nav ${show ? "show" : ""}`}>
              <ul>
                <li>
                  <button onClick={() => handleItemsPerPageChange(10)}>목록 개수 10개</button>
                  <button onClick={() => handleItemsPerPageChange(30)}>목록 개수 30개</button>
                  <button onClick={() => handleItemsPerPageChange(50)}>목록 개수 50개</button>
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
                  <input
                    type="checkbox"
                    className="checkboxs"
                    checked={checkedItems[contact.id] || false}
                    onChange={() => handleCheckboxChange(contact.id)}
                  />
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
              영구 삭제
            </button>
            <button className="btnlist btnblock">스팸 차단 해제</button>
            <nav className={`header__nav ${show2 ? "show2" : ""}`}>
              <ul>
                <li>
                  <button onClick={() => handleItemsPerPageChange(10)}>목록 개수 10개</button>
                  <button onClick={() => handleItemsPerPageChange(30)}>목록 개수 30개</button>
                  <button onClick={() => handleItemsPerPageChange(50)}>목록 개수 50개</button>
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
          {<button onClick={goToFirstPage}>{"|<"}</button>}
          {currentPage > 10 && <button onClick={goToPreviousPageSet}>{"<"}</button>}
          {pageNumbers.map((pageNumber) => (
            <button
              key={pageNumber}
              onClick={() => goToPage(pageNumber)}
              className={pageNumber === selectedPage ? "selected" : ""}
            >
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

export default Blockmail;

import React from "react";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { NavLink, Routes, Route, Link } from "react-router-dom";
import listnum from "../assets/img/btnlistnum.png";
import { useNavigate } from "react-router-dom";
import up from "../assets/img/up.png";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

const ITEMS_PER_PAGE = 10;

function Blockmail() {
  const scroll = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };
  const [checkedItems, setCheckedItems] = useState({});
  const [checkedMails, setcheckedMails] = useState({});

  const [contactData, setContactData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const [totalItems, setTotalItems] = useState(0); // 데이터의 총 갯수
  const [selectAll, setSelectAll] = useState(false); // 전체 선택 상태 추가
  const [selectedPage, setSelectedPage] = useState(currentPage); // 현재 선택된 페이지를 나타내는 상태 추가
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    fetchContactData();
  }, [currentPage, itemsPerPage]);

  //~ 로그인 되어있는지 확인하기
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      console.log("사용자 이메일:", user.email);
    } else {
      // 사용자 정보가 없는 경우
      console.log("로그인되지 않은 상태입니다.");
      navigate("/login");
    }
  };

  useEffect(() => {
    //~ 데이터의 총 갯수를 가져오는 함수
    const fetchTotalItems = async () => {
      try {
        const { count, error } = await supabase.from("blockmail").select("id", { count: "exact" });
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
  const handleItemsPerPageChange = (perPage) => {
    setItemsPerPage(perPage);
    setCurrentPage(1); // 페이지를 처음으로 리셋
  };
  //~ 10,20,30개 나타내기
  const fetchContactData = async () => {
    try {
      const { data, error } = await supabase
        .from("blockmail")
        .select("*")
        .order("id", { ascending: false })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1);
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
  let lastnum = String(currentPage).slice(-1);

  let startPage = Math.max(currentPage - lastnum + 1, 1); //시작하는 페이지
  if (lastnum == 1) {
    startPage = currentPage;
  }

  let endPage = startPage + maxPagesToShow - 1; //마지막 페이지
  if (
    lastnum == 0 //< 버튼 눌렀을때
  ) {
    endPage = currentPage;
    startPage = currentPage - 9;
  }

  if (endPage > totalPages) {
    endPage = totalPages;
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // 페이지 이동 함수
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    setSelectedPage(pageNumber); // 선택된 페이지 업데이트
  };

  //~ 10,20,30 버튼
  const [show, setshow] = useState(false);
  const toggleMenu = () => {
    setshow(!show);
  };
  const [show2, setshow2] = useState(false);
  const toggleMenu2 = () => {
    setshow2(!show2);
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
    let pnum = 10 - lastDigit;
    if (lastDigit == 0) {
      pnum = 0;
    }
    const newStartPage = Math.min(selectedPage + pnum + 1, totalPages);
    setCurrentPage(newStartPage);
    setSelectedPage(newStartPage);
  };

  //~ 삭제기능
  const handleDelete = async () => {
    const idsToDelete = Object.keys(checkedItems).filter((key) => checkedItems[key]);
    if (idsToDelete.length === 0) return;

    try {
      const { error } = await supabase.from("blockmail").delete().in("id", idsToDelete);
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

  //~ 페이지블럭기능
  const handleBlockCancle = async () => {
    const idsToBlock = Object.keys(checkedMails).filter((key) => checkedMails[key]);

    if (idsToBlock.length === 0) return;

    try {
      const { data, error } = await supabase.from("blockmail").select("*").in("id", idsToBlock);
      // 선택한 메일들 다 뽑아오기
      const blocklistEmails = [...new Set(data.map((item) => item.email))]; // 중복 합치기

      if (error) {
        throw error;
      }
      //* blocklistEmails에 있는 메일들을 가지고 있는 메일 데이터 가져오기
      const { data: blockData, error: contactError } = await supabase.from("blockmail").select("*").in("email", blocklistEmails); //eq는 단일값, in은 열 안에 포함된 값 중 하나와 일치하는 결과를 반환

      if (contactError) {
        throw contactError;
      }
      console.log("Data retrieved from contact:", contactData);

      //* "blockmail" 테이블에  blocklistEmails데이터 삭제
      // blocklistEmails 배열의 각 이메일 주소를 반복하여 데이터베이스에 삽입
      for (const email of blocklistEmails) {
        const { data: blockMailDetailResponse, error: blockMailDetailError } = await supabase.from("blockmaillist").delete().eq("maillist", email); // mail 객체에서 이메일 주소를 가져와서 이를 기준으로 삭제

        if (blockMailDetailError) {
          throw blockMailDetailError;
        }
        console.log("Data inserted into blockmail successfully:", blockMailDetailResponse);
      }

      //* "contact" 테이블에 메일 디테일 데이터 삽입

      const { data: blockMailDetailResponse, error: blockMailDetailError } = await supabase.from("contact").insert(blockData);

      if (blockMailDetailError) {
        throw blockMailDetailError;
      }
      console.log("Data inserted into blockmail successfully:", blockMailDetailResponse);

      //* "blockmail" 테이블에서 해당 메일 아이디와 일치하는 데이터 삭제
      const { data: deleteResponse, error: deleteError } = await supabase.from("blockmail").delete().in("email", blocklistEmails);
      if (deleteError) {
        throw deleteError;
      }
      console.log("Data deleted from contact successfully:", deleteResponse);
      window.location.reload(); // 페이지 새로고침
    } catch (error) {
      console.error("Error deleting contact data:", error.message);
    }
  };

  //~ 체크박스 상태 업데이트
  const handleCheckboxChange = (id, email) => {
    setcheckedMails((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
    setCheckedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  //~ 전체선택
  const handleSelectAll = () => {
    const newCheckedItems = {};
    const newCheckedMails = {};
    if (!selectAll) {
      contactData.forEach((contact) => {
        newCheckedItems[contact.id] = true;
        newCheckedMails[contact.id] = true;
      });
    }
    setCheckedItems(newCheckedItems);
    setcheckedMails(newCheckedItems);
    setSelectAll(!selectAll);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  return (
    <div>
      <section id="blockmail">
        <div className="blockmail_inner">
          <div className="btnspace">
            <button onClick={handleDelete} className=" btnlist btndel">
              삭제
            </button>
            <button className="btnlist btnblock" onClick={handleBlockCancle}>
              스팸 차단 해제
            </button>

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
          <div className="titlelist">
            <input type="checkbox" name="" id="ch" className="checkboz" style={{ display: "none" }} checked={selectAll} onChange={handleSelectAll} />
            <label htmlFor="ch"></label>

            <div className="num">번호</div>
            <div className="name">담당자이름</div>
            <div className="title">제목</div>
            <div className="time">날짜 및 시간</div>
          </div>
          <div className="maillist">
            <ul>
              {contactData.map((contact, index) => (
                <li className="maillistli" key={contact.id}>
                  <input type="checkbox" id={`ch-${index}`} style={{ display: "none" }} className="checkboxs" checked={checkedItems[contact.id] || false} onChange={() => handleCheckboxChange(contact.id)} />
                  <label htmlFor={`ch-${index}`}></label>

                  <NavLink to={`/userpage/blockmaildetail/${contact.id}/${(currentPage - 1) * itemsPerPage + index + 1}`} className="datalist">
                    <div className="num">{(currentPage - 1) * itemsPerPage + index + 1}</div>
                    <div className="name">{contact.name}</div>
                    <div className="title maintitle">{contact.title}</div>
                    <div className="time">{contact.time}</div>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="btnspace">
            <button onClick={handleDelete} className=" btnlist btndel">
              삭제
            </button>
            <button className="btnlist btnblock" onClick={handleBlockCancle}>
              스팸 차단 해제
            </button>
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
            <button key={pageNumber} onClick={() => goToPage(pageNumber)} className={pageNumber === selectedPage ? "selected" : ""}>
              {pageNumber}
            </button>
          ))}
          {totalPages > 10 && currentPage < totalPages && <button onClick={goToNextPageSet}>{">"}</button>}
          <button onClick={goToLastPage}>{">|"}</button>
          <button onClick={scroll} className="page_up">
            <img src={up} alt="" />
          </button>
        </div>
      </section>
    </div>
  );
}

export default Blockmail;

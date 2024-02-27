// prettier-ignore

import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

function Addwork() {
  const movePage = useNavigate();

  // 글자 감지
  const [titleLength, setTitleLength] = useState(0);
  const handleTitleChange = (e) => {
    setTitleLength(e.target.value.length);
    console.log(e.target.value);
  };

  //파일 이름 추출
  const [fileName, setFileName] = useState("");
  const handleFileChange = (e) => {
    const fileName = e.target.value.split("\\").pop(); // 파일 경로에서 파일 이름만 추출
    setFileName(fileName); // 파일 이름 상태 업데이트
  };

  // 채크박스
  const [isChecked, setIsChecked] = useState(true);
  const [isChecked2, setIsChecked2] = useState(true);

  // const handleCheckboxChange = (e) => {
  //   setIsChecked(e.target.checked);
  //   console.log(e.target.checked);
  // };
  const handleCheckboxChange1 = () => {
    setIsChecked((preCheck) => {
      return !preCheck;
    });
  };
  const handleCheckboxChange2 = () => {
    setIsChecked2((preCheck) => {
      return !preCheck;
    });
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const [formData, setFormData] = useState({});
  console.log(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      // isChecked,
    });
    // console.log(e);
  };

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const { data: responseData, error } = await supabase.from("work").insert([formData]);
      console.log(responseData);
      if (error) {
        throw error;
      }
      console.log("Data inserted successfully:", responseData);
    } catch (error) {
      console.error("Error inserting data:", error.message);
    }
  };

  return (
    <div>
      <section id="addwork">
        <div className="addwork__inner">
          <h1 className="addwork__title">작업물 추가</h1>
          <div className="addwork__text">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* 제목 */}
              <div>큰 제목</div>
              <input type="text" name="title" value={formData.title || ""} maxLength={15} onChange={handleChange} />

              {/* 본문 내용 */}
              <div>본문 내용</div>
              <input type="text" name="body" maxLength={23} onChange={handleChange} />

              {/* 분야 */}
              <div className="checkboxline">
                {" "}
                <div>분야</div>
                <div className="worktype">
                  <div>
                    <input type="checkbox" id="code" value={isChecked ? "true" : "false"} name="code" onClick={handleCheckboxChange1} onChange={handleChange} />
                    <label htmlFor="code">개발</label>
                    <p>체크 상태: {isChecked ? "체크됨" : "체크 안 됨"}</p>
                  </div>
                  <div>
                    <input type="checkbox" id="design" name="design" value={isChecked2 ? "true" : "false"} onClick={handleCheckboxChange2} onChange={handleChange} />
                    <label htmlFor="design">디자인</label>
                    {/* <p>체크 상태: {isChecked ? "체크됨" : "체크 안 됨"}</p> */}
                  </div>
                </div>
              </div>

              {/* 이미지 */}
              <div>이미지</div>
              <div className="filebox">
                {" "}
                <input type="text" className="upload-name" value={fileName} readOnly />
                <label htmlFor="file" className="btn-upload">
                  찾기
                </label>
                <input className="btn" type="file" name="file" id="file" onChange={handleFileChange} />
              </div>
              <button type="submit">보내기</button>
            </form>

            <div className="addimg">
              {" "}
              <button>이미지 추가</button>
            </div>
          </div>

          <div className="line"></div>

          <div className="addwork__btn">
            <button
              onClick={() => {
                movePage("/userpage");
              }}
            >
              취소
            </button>
            <button type="submit">확인</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Addwork;

// prettier-ignore

import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

function Addwork() {
  const movePage = useNavigate();

  const [forms, setForms] = useState([]);

  const addForm = () => {
    setForms([...forms, {}]); // Add a new form object to the forms array
  };

  //~ 글자 감지
  const [titleLength, setTitleLength] = useState(0);
  const handleTitleChange = (e) => {
    setTitleLength(e.target.value.length);
    console.log(e.target.value);
  };

  //~ 사진 추출
  const [fileName, setFileName] = useState("");
  const handleFileChange2 = (e) => {
    const fileName = e.target.value.split("\\").pop(); // 파일 경로에서 파일 이름만 추출
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    setFileName(selectedFile); // 파일 이름 상태 업데이트
  };

  //~ 체크박스
  const [isChecked, setIsChecked] = useState(true);
  const [isChecked2, setIsChecked2] = useState(true);

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
  console.log("supabase에 입력될 값", formData);

  //~ form에 적은 값들 업데이트
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //~ supabase로 보내요

  const onSubmit2 = async () => {
    try {
      const { data, error } = await supabase.storage.from("images").upload(fileName.name, fileName);

      if (error) {
        throw error;
      }

      const imageUrl2 = supabase.storage.from("images").getPublicUrl(fileName.name, fileName);
      const imageUrl = imageUrl2.data.publicUrl;
      // 이미지의 공개 URL을 가져온 후 데이터를 데이터베이스에 삽입합니다.
      console.log(imageUrl2);
      console.log(imageUrl);
      await onSubmit(imageUrl);
      console.log("데이터 넣기 성공:", data);
      console.log(data);
    } catch (error) {
      console.error("Error inserting data:", error.message);
    }
  };

  const onSubmit = async (imageUrl) => {
    try {
      // 이미지 URL을 formData에 추가합니다.
      const formDataWithImage = { ...formData, imageUrl };
      console.log(formDataWithImage);

      const { data2, error } = await supabase.from("work").insert([formDataWithImage]);
      console.log(data2);
      if (error) {
        throw error;
      }
      console.log("Data inserted successfully:", data2);
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
            <form onSubmit={handleSubmit(onSubmit2)}>
              {/* 제목 */}
              <div>큰 제목</div>
              <input type="text" name="title" maxLength={15} onChange={handleChange} />
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
                  </div>
                  <div>
                    <input type="checkbox" id="design" name="design" value={isChecked2 ? "true" : "false"} onClick={handleCheckboxChange2} onChange={handleChange} />
                    <label htmlFor="design">디자인</label>
                  </div>
                </div>
              </div>
              {/* 이미지 */}

              <div>이미지</div>
              <div className="filebox">
                <input type="text" className="upload-name" value={fileName.name || ""} readOnly />
                <label htmlFor="file" className="btn-upload">
                  찾기
                </label>
                <input
                  className="btn"
                  type="file"
                  name="file"
                  id="file"
                  onChange={(e) => {
                    handleFileChange2(e);
                  }}
                />
              </div>
              {/* <button type="submit">보내기</button> */}
            </form>

            <div className="addimg">
              {" "}
              <button onClick={addForm}>이미지 추가</button>
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
            <button onClick={handleSubmit(onSubmit2)}>확인</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Addwork;

// prettier-ignore

import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuid } from "uuid";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

function Addwork() {
  const movePage = useNavigate();
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
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  //~ 글자 감지
  const [bigTextLength, setBigTextLength] = useState(0);
  const handleBigTextChange = (e) => {
    setBigTextLength(e.target.value.length);
    console.log(e.target.value);
  };
  const [textLength, setTextLength] = useState(0);
  const handleTextChange = (e) => {
    setTextLength(e.target.value.length);
    console.log(e.target.value);
  };

  //~ 체크박스
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);

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

  //~ form에 적은 값들 업데이트
  const [formData, setFormData] = useState({});
  console.log("supabase에 입력될 값", formData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  //~ 이미지 입력칸 클릭 시 새로운 이미지 입력칸 추가
  const [imageInputs, setImageInputs] = useState([{ fileName: "", file: null }]);

  const handleImageInputClick = () => {
    setImageInputs([...imageInputs, { fileName: "", file: null }]); // 새로운 이미지 입력칸 추가
  };

  //~사진 업로드 하고 경로 올려주기

  const handleFileChange = async (index, e) => {
    console.log(index);
    const selectedFile = e.target.files[0];

    const finalFileList = [...imageInputs];
    finalFileList[index] = { fileName: selectedFile ? selectedFile.name : "", file: selectedFile }; // 파일 이름 및 파일 객체 저장
    console.log(finalFileList);
    setImageInputs(finalFileList); // 파일 리스트 업데이트
  };

  //~ supabase로 보내요
  const { v4: uuidv4 } = require("uuid"); // uuid 모듈을 불러옵니다.

  const onSubmit = async (data) => {
    try {
      // 이미지 업로드 및 URL 획득
      // const uploadedImages = await Promise.all(
      //   imageInputs.map(async (input) => {
      //     if (!input.file) {
      //       console.log("아무것도 없지롱");
      //       return null;
      //     }
      //     const selectedFile = input.file;
      //     const imageName = `${Date.now()}`; // 이미지 이름 생성
      //     console.log(imageName);
      //     const { data, error } = await supabase.storage.from("images").upload(imageName, selectedFile, { overwrite: true });
      //     if (error) throw error;
      //     const imageUrl = await supabase.storage.from("images").getPublicUrl(imageName);
      //     console.log(imageUrl.data.publicUrl);
      //     return { imageUrl: imageUrl.data.publicUrl, imageName: imageName }; // 이미지 URL과 이미지 이름을 객체로 반환
      //   })
      // );

      const uploadedImages = await Promise.all(
        imageInputs.map(async (input) => {
          console.log(input);
          if (!input.file) {
            return null;
          }
          const selectedFile = input.file;
          const imageName = `${uuidv4()}`;
          // const imageName = `${Date.now()}`; //파일 이름 바꾸기
          const { data, error } = await supabase.storage.from("images").upload(imageName, selectedFile); // 파일 올리기
          if (error) throw error;
          const imageUrl = await supabase.storage.from("images").getPublicUrl(imageName);
          console.log(imageUrl.data.publicUrl);
          return { imageUrl: imageUrl.data.publicUrl, imageName: imageName };
        })
      );

      const filteredImages = uploadedImages.filter((url) => url !== null);

      console.log(filteredImages);

      // // 데이터베이스에 삽입할 데이터 준비
      // const formDataWithImages = { ...formData, fileUrlList: filteredImages };
      // console.log(formDataWithImages);

      // // uploadedImages 배열에는 { imageUrl: "publicUrl", imageName: "imageName" } 형식의 객체들이 담김
      // console.log(uploadedImages);
      // // 이미지 URL과 이미지 이름을 따로 담을 배열들
      const imageUrls = filteredImages.map((image) => image.imageUrl);
      const imageNames = filteredImages.map((image) => image.imageName);
      console.log(imageUrls);
      console.log(imageNames);

      // const filteredImages = imageUrls.filter((url) => url !== null);
      // const filteredNames = imageNames.filter((url) => url !== null);

      // console.log(filteredImages);
      // console.log(filteredNames);

      // 데이터베이스에 삽입할 데이터 준비
      const formDataWithImages = { ...formData, fileUrlList: imageUrls, fileNameList: imageNames };
      console.log(formDataWithImages);

      // 데이터베이스에 데이터 삽입
      const { data: insertedData, error } = await supabase.from("work").insert([formDataWithImages]);
      if (error) throw error;

      console.log("Data inserted successfully:", insertedData);
      // 페이지 이동 등 추가 작업이 필요하다면 이곳에 추가
      movePage("/userpage/workpage");
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleBigInputChange = (e) => {
    handleChange(e); // handleChange 함수 호출
    handleBigTextChange(e); // handleBigTextChange 함수 호출
  };
  const handleInputChange = (e) => {
    handleChange(e); // handleChange 함수 호출
    handleTextChange(e); // handleBigTextChange 함수 호출
  };

  return (
    <div>
      <section id="addwork">
        <div className="addwork__inner">
          <h1 className="addwork__title">작업물 추가</h1>
          <div className="addwork__text">
            <form>
              {/* 제목 */}
              <div style={{ display: "flex" }}>
                <div>큰 제목</div> <div style={{ marginLeft: "auto" }}>{bigTextLength} / 15</div>
              </div>

              <input
                type="text"
                name="title"
                maxLength={15}
                {...register("title", {
                  required: "제목을 입력하세요",
                  onChange: (e) => {
                    handleBigInputChange(e);
                  },
                })}
              />
              {errors.title && <p style={{ color: "red" }}>{errors.title.message}</p>}
              {/* 본문 내용 */}
              <div style={{ display: "flex", marginTop: "50px" }}>
                <div>본문 내용</div> <div style={{ marginLeft: "auto" }}>{textLength} / 25</div>
              </div>

              <input
                type="text"
                name="body"
                maxLength={25}
                {...register("body", {
                  required: "내용을 입력하세요",
                  onChange: (e) => {
                    handleInputChange(e);
                  },
                })}
              />
              {errors.body && <p style={{ color: "red" }}>{errors.body.message}</p>}

              {/* 분야 */}
              <div className="checkboxline">
                {" "}
                <div style={{ marginTop: "50px" }}>분야</div>
                <div className="worktype">
                  <div>
                    <input type="checkbox" id="code" value={isChecked ? "false" : "true"} name="code" onClick={handleCheckboxChange1} onChange={handleChange} />
                    <label htmlFor="code">개발</label>
                  </div>
                  <div>
                    <input type="checkbox" id="design" name="design" value={isChecked2 ? "false" : "true"} onClick={handleCheckboxChange2} onChange={handleChange} />
                    <label htmlFor="design">디자인</label>
                  </div>
                </div>
              </div>
              {/* 이미지 */}

              {imageInputs.map((input, index) => (
                <div key={index}>
                  <div>이미지{index + 1}</div>
                  <div className="filebox">
                    <input type="text" className="upload-name" value={input.file ? input.file.name : ""} readOnly />
                    <label htmlFor={`file-${index}`} className="btn-upload">
                      찾기
                    </label>
                    <input className="btnaddimg" type="file" name={`file-${index}`} id={`file-${index}`} onChange={(e) => handleFileChange(index, e)} />
                  </div>
                </div>
              ))}
            </form>

            <div className="addimg">
              <button onClick={handleImageInputClick}>이미지 추가</button>
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
            <button onClick={handleSubmit(onSubmit)}>확인</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Addwork;

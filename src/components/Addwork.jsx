// prettier-ignore

import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createClient } from "@supabase/supabase-js";
import home from "../assets/img/home.png";
import up from "../assets/img/up.png";
import { checkList } from "../components/checkList";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

function Addwork() {
  const [workData, setworkData] = useState([]);

  useEffect(() => {
    fetchWorkData();
  }, []);

  const fetchWorkData = async () => {
    try {
      const { data, error } = await supabase.from("work").select("number").order("number", { ascending: false });

      if (error) {
        throw error;
      }
      setworkData(data);
    } catch (error) {
      console.error("Error fetching contact data:", error.message);
    }
  };
  console.log(workData);

  // console.log(checkList);
  const scroll = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };

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
      // 사용자 정보가 없는 경우
      console.log("로그인되지 않은 상태입니다.");
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
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
  const [codeIsChecked, setCodeIsChecked] = useState(false);
  const [designIsChecked, setDesignIsChecked] = useState(false);
  const [videoIsChecked, setVideoIsChecked2] = useState(false);

  const handleCodeCheckboxChange = () => {
    setCodeIsChecked((preCheck) => {
      return !preCheck;
    });
  };
  const handleDesignCheckboxChange = () => {
    setDesignIsChecked((preCheck) => {
      return !preCheck;
    });
  };
  const handleVideoCheckboxChange = () => {
    setVideoIsChecked2((preCheck) => {
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
    const selectedFile = e.target.files[0];
    const finalFileList = [...imageInputs];
    finalFileList[index] = { fileName: selectedFile ? selectedFile.name : "", file: selectedFile }; // 파일 이름 및 파일 객체 저장
    setImageInputs(finalFileList); // 파일 리스트 업데이트
  };

  //~ 썸네일 사진
  const [thumbNail, setThumbNail] = useState({ file: null, fileName: "" });
  const handleThumbNail = async (e) => {
    const selectedThumbNailFile = e.target.files[0];
    const selectedThumbNail = { fileName: selectedThumbNailFile ? selectedThumbNailFile.name : "", file: selectedThumbNailFile };
    setThumbNail(selectedThumbNail);
  };
  console.log(thumbNail);

  //~ supabase로 보내요
  const { v4: uuidv4 } = require("uuid"); // uuid 모듈을 불러옵니다.
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    try {
      const anyChecked = Object.values(checkedItems).some((checked) => checked); // 어떤 체크박스가 선택되었는지 확인
      if (!anyChecked) {
        alert("프로그램 언어 또는 디자인 기술을 체크해 주세요."); // 하나도 선택되지 않았을 때 얼랏창 띄우기
        return;
      }
      console.log("클릭");
      setIsSubmitting(true);
      let thumbNailUrl = null; // 썸네일 이미지 URL 초기값 설정

      // 썸네일 이미지가 있는 경우에만 업로드
      if (thumbNail.file) {
        // 썸네일 이미지 업로드
        const thumbNailName = `${uuidv4()}`;
        const { data: thumbNailData, error: thumbNailError } = await supabase.storage.from("images").upload(thumbNailName, thumbNail.file);
        if (thumbNailError) {
          throw thumbNailError;
        }
        const fakethumbNailUrl = await supabase.storage.from("images").getPublicUrl(thumbNailName);
        thumbNailUrl = fakethumbNailUrl.data.publicUrl;
      }
      const uploadedImages = await Promise.all(
        imageInputs.map(async (input) => {
          if (!input.file) {
            return null;
          }
          const selectedFile = input.file;
          const imageName = `${uuidv4()}`;
          const { data, error } = await supabase.storage.from("images").upload(imageName, selectedFile); // 파일 올리기
          if (error) throw error;
          const imageUrl = await supabase.storage.from("images").getPublicUrl(imageName);
          return { imageUrl: imageUrl.data.publicUrl, imageName: imageName };
        })
      );

      const filteredImages = uploadedImages.filter((url) => url !== null);

      const imageUrls = filteredImages.map((image) => image.imageUrl);
      const imageNames = filteredImages.map((image) => image.imageName);
      const lastWorkNumber = workData.length > 0 ? workData[0].number : 0; // 가장 마지막 작업의 number 값
      console.log(lastWorkNumber);
      const newWorkNumber = lastWorkNumber + 1; // 새로운 작업의 number 값
      // 데이터베이스에 삽입할 데이터 준비
      const formDataWithImages = { ...formData, fileUrlList: imageUrls, fileNameList: imageNames, thumbNailUrl: thumbNailUrl, checkItemList: finalCheckedItems, number: newWorkNumber };
      // workData 배열의 가장 마지막 항목의 number 값을 찾아서 1을 더하여 새로운 데이터의 number 값으로 설정

      // 데이터베이스에 데이터 삽입
      const { data: insertedData, error } = await supabase.from("work").insert([formDataWithImages]);
      if (error) throw error;

      console.log("Data inserted successfully:", insertedData);
      // 페이지 이동 등 추가 작업이 필요하다면 이곳에 추가
      setIsSubmitting(false);

      movePage("/userpage/workpage");
    } catch (error) {
      console.error("Error:", error.message);
      setIsSubmitting(false);
    }
  };

  const handleBigInputChange = (e) => {
    handleChange(e); // handleChange 함수 호출
    handleBigTextChange(e); // handleBigTextChange 함수 호출
  };
  console.log(bigTextLength, textLength);
  const handleInputChange = (e) => {
    handleChange(e); // handleChange 함수 호출
    handleTextChange(e); // handleBigTextChange 함수 호출
  };

  //~ 체크 리스트
  const [checkedItems, setCheckedItems] = useState({});
  const [finalCheckedItems, setFinalCheckedItems] = useState([]);

  const handleCheckboxChange = (e, itemName, index) => {
    const { id, checked } = e.target;
    console.log(e, itemName, index);
    // 체크박스가 체크되었을 때 해당 체크박스의 이름을 상태로 저장
    setCheckedItems((prevCheckedItems) => {
      const updatedCheckedItems = { ...prevCheckedItems, [index]: checked ? itemName : "" };
      // 버튼 클릭 이벤트 핸들러를 호출하여 최종 체크된 항목들을 업데이트
      handleButtonClick(updatedCheckedItems);
      return updatedCheckedItems;
    });
  };

  const handleButtonClick = (checkedItems) => {
    console.log(checkedItems);
    // checkedItems 객체에서 값이 true인 키(체크된 체크박스의 id)들만 모아서 배열로 반환
    const checkedItemsArray = Object.values(checkedItems).filter((value) => value);
    console.log(checkedItemsArray);
    // 인덱스 순서대로 정렬
    checkedItemsArray.sort((a, b) => a - b);
    setFinalCheckedItems(checkedItemsArray);
  };
  console.log(finalCheckedItems);

  return (
    <div>
      <section id="addwork">
        <div className="addwork__inner">
          <h1 className="addwork__title">작업물 추가</h1>
          <button
            className="btnhome"
            onClick={() => {
              movePage("/");
            }}
          >
            <img src={home} alt="" className="homebtn" />
          </button>
          <div className="addwork__text">
            <form>
              <div style={{ display: "flex" }}>
                <div>큰 제목</div> <div style={{ marginLeft: "auto" }}>{bigTextLength} / 20</div>
              </div>

              <input
                type="text"
                name="title"
                maxLength={20}
                {...register("title", {
                  required: "제목을 입력하세요",
                  onChange: (e) => {
                    handleBigInputChange(e);
                  },
                })}
              />
              {errors.title && <p style={{ color: "red" }}>{errors.title.message}</p>}
              <div style={{ display: "flex", marginTop: "50px" }}>
                <div>본문 내용</div> <div style={{ marginLeft: "auto" }}>{textLength} / 50</div>
              </div>

              <input
                type="text"
                name="body"
                maxLength={50}
                {...register("body", {
                  required: "내용을 입력하세요",
                  onChange: (e) => {
                    handleInputChange(e);
                  },
                })}
              />
              {errors.body && <p style={{ color: "red" }}>{errors.body.message}</p>}

              <div className="checkboxline">
                {" "}
                <div style={{ marginTop: "50px" }}>분야</div>
                <div className="worktype">
                  <div>
                    <input type="checkbox" className="checkboxs" id="code" value={codeIsChecked ? "false" : "true"} name="code" onClick={handleCodeCheckboxChange} onChange={handleChange} />
                    <label htmlFor="code">개발</label>
                  </div>
                  <div>
                    <input type="checkbox" className="checkboxs" id="design" name="design" value={designIsChecked ? "false" : "true"} onClick={handleDesignCheckboxChange} onChange={handleChange} />
                    <label htmlFor="design">디자인</label>
                  </div>
                  <div>
                    <input type="checkbox" className="checkboxs" id="video" name="video" value={videoIsChecked ? "false" : "true"} onClick={handleVideoCheckboxChange} onChange={handleChange} />
                    <label htmlFor="video">영상</label>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: "24px" }}>체크</div>
              <div className="checklist">
                <ul>
                  {checkList.map((item, index) => (
                    <li key={index}>
                      <input type="checkbox" id={`checkbox-${index}`} className="checkboxs" style={{ display: "none" }} onChange={(e) => handleCheckboxChange(e, item, index)} {...register} />
                      {/* <input type="checkbox" id={`checkbox-${index}`} className="checkboxs" style={{ display: "none" }} onChange={(e) => handleCheckboxChange(e, item)} checked={checkedItems[`checkbox-${index}`] === item} /> */}
                      <label htmlFor={`checkbox-${index}`}>{item}</label>
                    </li>
                  ))}
                </ul>
              </div>
              <div style={{ marginTop: "50px" }}>리스트 이미지 (16:10 비율)</div>
              <div className="filebox">
                <input type="text" className="upload-name" value={thumbNail ? thumbNail.fileName : ""} readOnly />
                <label htmlFor={`file`} className="btn-upload">
                  찾기
                </label>
                <input className="btnaddimg" type="file" name="file" id="file" onChange={(e) => handleThumbNail(e)} />
              </div>

              {imageInputs.map((input, index) => (
                <div key={index}>
                  <div>본문 이미지{index + 1}</div>
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
              className="cancle"
            >
              취소
            </button>
            <button onClick={handleSubmit(onSubmit)} className="ok" disabled={isSubmitting}>
              확인
            </button>
            <button onClick={scroll} className="page_up">
              <img src={up} alt="" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Addwork;

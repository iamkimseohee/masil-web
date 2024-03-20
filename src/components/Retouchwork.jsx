import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createClient } from "@supabase/supabase-js";
import movebtn from "../assets/img/move.png";
import delbtn from "../assets/img/delbtn.png";
import { v4 as uuid } from "uuid";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

function Retouchwork() {
  const navigate = useNavigate();
  const { id } = useParams();

  const movePage = useNavigate();

  //~ 정보 가져오기
  const [workDetail, setWorkDetail] = useState(null);

  const fetchWorkDetail = async (id) => {
    try {
      const { data, error } = await supabase.from("work").select("*").eq("id", id).single();
      // console.log("기존", data);

      if (error) {
        throw error;
      }
      setWorkDetail(data);
    } catch (error) {
      console.error("Error fetching mail detail:", error.message);
    }
  };
  console.log(workDetail);
  const maxArr = 8 - (workDetail && workDetail.fileUrlList.length);
  // console.log(maxArr);
  // console.log(workDetail && workDetail.fileUrlList.length);

  useEffect(() => {
    fetchWorkDetail(id);
  }, [id]);

  const {
    register,
    handleSubmit,
    setValue,

    formState: { errors },
  } = useForm({
    values: {
      title: workDetail && workDetail.title,
      body: workDetail && workDetail.body,
    },
  });
  // console.log(register);

  useEffect(() => {
    if (workDetail) {
      setIsChecked(workDetail.code);
      setIsChecked2(workDetail.design);
    }
  }, [workDetail]);

  //~ 글자 감지

  const [bigTextLength, setBigTextLength] = useState(0);

  useEffect(() => {
    if (workDetail && workDetail.title) {
      setBigTextLength(workDetail.title.length);
    } else {
      setBigTextLength(0); // workDetail이 null이거나 title이 없는 경우 초기값으로 설정
    }
    if (workDetail && workDetail.body) {
      setTextLength(workDetail.body.length);
    } else {
      setTextLength(0); // workDetail이 null이거나 title이 없는 경우 초기값으로 설정
    }
  }, [workDetail]);

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
  const [isChecked, setIsChecked] = useState("");
  const [isChecked2, setIsChecked2] = useState("");
  // console.log(isChecked, isChecked2);
  const handleCheckboxChange1 = () => {
    setIsChecked((preCheck) => {
      console.log("preCheck🟰🟰🟰🟰🟰🟰🟰🟰", preCheck);
      return !preCheck;
    });
  };
  const handleCheckboxChange2 = () => {
    setIsChecked2((preCheck) => {
      console.log("preCheck🟰🟰🟰🟰🟰🟰🟰🟰", preCheck);

      return !preCheck;
    });
  };

  // //~ 글자 감지
  // const [titleLength, setTitleLength] = useState(0);
  // const handleTitleChange = (e) => {
  //   setTitleLength(e.target.value.length);
  //   console.log(e.target.value);
  // };

  //~ 사진 추출
  // const [fileName, setFileName] = useState("");
  // const handleFileChange2 = (e) => {
  //   // const fileName = e.target.value.split("\\").pop(); // 파일 경로에서 파일 이름만 추출
  //   const selectedFile = e.target.files[0];
  //   console.log(selectedFile);
  //   setFileName(selectedFile); // 파일 이름 상태 업데이트
  // };

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

  const [imageInputs, setImageInputs] = useState([{ fileName: "", file: null }]);

  //~ 이미지 입력칸 클릭 시 새로운 이미지 입력칸 추가
  const handleImageInputClick = () => {
    setImageInputs([...imageInputs, { fileName: "", file: null }]); // 새로운 이미지 입력칸 추가
    // console.log("setImageInputs 🚨", setImageInputs);
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
      // 기존 이미지 URL들을 가져옵니다.
      const existingImageUrls = workDetail.fileUrlList || [];
      const existingImageNamses = workDetail.fileNameList || [];

      // 새로 업로드할 이미지 URL들을 업로드합니다.
      const uploadedImages = await Promise.all(
        imageInputs.map(async (input) => {
          console.log(input);
          if (!input.file) {
            return null; // 이미지가 선택되지 않은 경우 null 반환
          }
          const selectedFile = input.file;

          // const imageName = `${Date.now()}_${selectedFile.name}`; // 파일 이름 생성
          // const imageName = `${Date.now()}`; // 파일 이름 생성
          const imageName = `${uuidv4()}`;
          const { data, error } = await supabase.storage.from("images").upload(imageName, selectedFile, { overwrite: true });

          if (error) throw error;
          const imageUrl = await supabase.storage.from("images").getPublicUrl(imageName);
          console.log(imageUrl.data.publicUrl);
          return { imageUrl: imageUrl.data.publicUrl, imageName: imageName };
        })
      );
      console.log(uploadedImages);
      // null 값을 제거하여 새로운 배열 생성
      const filteredImages = uploadedImages.filter((url) => url !== null);

      console.log(filteredImages);
      const imageUrls = filteredImages.map((image) => image.imageUrl);
      const imageNames = filteredImages.map((image) => image.imageName);
      console.log(imageUrls);
      console.log(imageNames);

      // 기존 이미지 URL들과 새로 업로드한 이미지 URL들을 합칩니다.
      const allImageUrls = [...existingImageUrls, ...imageUrls];
      const allImageNames = [...existingImageNamses, ...imageNames];

      // 데이터베이스에 삽입할 데이터 준비
      const formDataWithImages = { ...formData, fileUrlList: allImageUrls, fileNameList: allImageNames };
      console.log(formDataWithImages);

      // 데이터베이스에 데이터 삽입
      const { data: updatedData, error } = await supabase.from("work").update(formDataWithImages).eq("id", id);
      console.log(data, id);
      if (error) throw error;

      console.log("Data inserted successfully:", updatedData);
      // console.log(delName);
      delName.map(async (imageUrl) => {
        console.log(imageUrl);
        try {
          // Supabase Storage에서 이미지 삭제
          await supabase.storage.from("images").remove([imageUrl]);

          console.log("Image deleted successfully from storage:", imageUrl);
        } catch (error) {
          console.error("Error deleting image from storage:", error.message);
        }
      });
      navigate("/userpage/workpage");
      // 페이지 이동 등 추가 작업이 필요하다면 이곳에 추가
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  //~사진 삭제
  const [delName, setDelName] = useState([]);

  const handleImageDelete = (index) => {
    console.log(index);
    const updatedFileUrlList = [...workDetail.fileUrlList];
    const updatedFileNameList = [...workDetail.fileNameList];

    console.log(updatedFileUrlList);
    console.log(updatedFileNameList);
    const deletedImageName = updatedFileNameList[index]; // 삭제된 이미지 URL 저장
    console.log(deletedImageName);
    updatedFileUrlList.splice(index, 1); // 해당 인덱스의 이미지 URL 제거
    updatedFileNameList.splice(index, 1); // 해당 인덱스의 이미지 Name 제거
    setWorkDetail({ ...workDetail, fileUrlList: updatedFileUrlList, fileNameList: updatedFileNameList }); // 이미지 URL 목록 업데이트
    setDelName([...delName, deletedImageName]);

    // deleteImageFromStorage(deletedImageName);
  };
  console.log(delName);

  // const deleteImageFromStorage =

  //~드래그 기능
  const [draggedItemId, setDraggedItemId] = useState(null);

  const handleDragStart = (e, id) => {
    console.log("내가 선택한 id", id);
    // e.dataTransfer.effectAllowed = "move"; // +버튼 생기는거 맞아주기
    setDraggedItemId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropZoneId, work) => {
    e.preventDefault();
    // console.log(workDetail.fileUrlList);
    console.log("내가 놓은 id", dropZoneId);
    // console.log(e);

    // 드래그된 요소를 배열에서 제거합니다.
    const draggedWork = workDetail.fileUrlList[draggedItemId];
    const newWorkData = workDetail.fileUrlList.filter((_, index) => index !== draggedItemId);

    const draggedWorkName = workDetail.fileNameList[draggedItemId];
    const newWorkDataName = workDetail.fileNameList.filter((_, index) => index !== draggedItemId);
    console.log(newWorkData);

    // 드롭된 위치에 드래그된 요소를 삽입합니다.
    const updatedWorkData = [...newWorkData.slice(0, dropZoneId), draggedWork, ...newWorkData.slice(dropZoneId)];
    const updatedWorkDataName = [...newWorkData.slice(0, dropZoneId), draggedWorkName, ...newWorkDataName.slice(dropZoneId)];

    // 변경된 배열을 상태에 설정합니다.
    setWorkDetail({ ...workDetail, fileUrlList: updatedWorkData, fileNameList: updatedWorkDataName });
    setDraggedItemId(null);
  };

  const { text, sett } = useState("text");
  const handleBigInputChange = (e) => {
    handleChange(e); // handleChange 함수 호출
    handleBigTextChange(e); // handleBigTextChange 함수 호출
  };
  const handleInputChange = (e) => {
    handleChange(e); // handleChange 함수 호출
    handleTextChange(e); // handleBigTextChange 함수 호출
  };

  // <input
  //   type="text"
  //   value={test}
  //   onChange={(e) => {
  //     sett(e.target.value);
  //   }}
  // />;

  return (
    <div>
      <section id="retouchwork">
        <div className="retouchwork__inner">
          <h1 className="retouchwork__title">작업물 수정</h1>
          <div className="retouchwork__body">
            <form>
              {/* 제목 */}
              <div style={{ display: "flex" }}>
                <div>큰 제목</div> <div style={{ marginLeft: "auto" }}>{bigTextLength} / 15</div>
              </div>
              <input
                type="text"
                name="title"
                // defaultValue={workDetail && workDetail.title}
                maxLength={15}
                {...register("title", {
                  required: "제목을 입력하세요",
                  // value: "hdfukj",
                  onChange: (e) => {
                    // setWorkDetail({ ...workDetail, title: e.target.value });
                    handleBigInputChange(e);
                  },
                })}
              />
              {errors.title && <p style={{ color: "red" }}>{errors.title.message}</p>}

              {/* 본문 내용 */}
              <div style={{ display: "flex", marginTop: "50px" }}>
                <div>본문 내용</div> <div style={{ marginLeft: "auto" }}>{textLength} / 25</div>{" "}
              </div>
              <input
                type="text"
                name="body"
                // defaultValue={workDetail && workDetail.body}
                maxLength={25}
                {...register("body", {
                  required: "내용을 입력하세요",
                  // value: "hi",

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
                    <input type="checkbox" id="code" checked={isChecked} onClick={handleCheckboxChange1} value={isChecked ? "false" : "true"} name="code" onChange={handleChange} />
                    <label htmlFor="code">개발</label>
                  </div>
                  <div>
                    <input type="checkbox" id="design" name="design" checked={isChecked2} value={isChecked2 ? "false" : "true"} onClick={handleCheckboxChange2} onChange={handleChange} />
                    <label htmlFor="design">디자인</label>
                  </div>
                </div>
              </div>
              {/* //~ 사진 나와주세용 */}
              <div className="workpic">
                {workDetail &&
                  workDetail.fileUrlList &&
                  workDetail.fileUrlList.map((url, index) => (
                    <div key={index} className="image-container" onDrop={(e) => handleDrop(e, index)} onDragOver={handleDragOver}>
                      <img onClick={() => handleImageDelete(index)} draggable="false" src={delbtn} alt="" className="del-btn" />
                      <img
                        src={movebtn}
                        alt=""
                        className="move-btn"
                        draggable="true"
                        onDragStart={(e) => {
                          handleDragStart(e, index);
                        }}
                      />
                      <img className="pic" src={url} alt={`Image ${index}`} draggable="false" />
                    </div>
                  ))}
              </div>

              {/* //~ 이미지 입력창 */}
              {imageInputs.slice(0, maxArr).map((input, index) => (
                <div key={index}>
                  <div>추가할 이미지{index + 1}</div>
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

export default Retouchwork;

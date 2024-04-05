import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createClient } from "@supabase/supabase-js";
import movebtn from "../assets/img/move.png";
import delbtn from "../assets/img/delbtn.png";
import home from "../assets/img/home.png";
import up from "../assets/img/up.png";
import retouch from "../assets/img/retouch.png";
import { checkList } from "../components/checkList";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

function Retouchwork() {
  const scroll = () => {
    window.scroll({
      top: 0,
      behavior: "smooth",
    });
  };
  const navigate = useNavigate();
  const { id } = useParams();

  const movePage = useNavigate();

  //~ 정보 가져오기
  const [workDetail, setWorkDetail] = useState(null);

  const fetchWorkDetail = async (id) => {
    try {
      const { data, error } = await supabase.from("work").select("*").eq("id", id).single();
      if (error) {
        throw error;
      }
      setWorkDetail(data);
    } catch (error) {
      console.error("Error fetching mail detail:", error.message);
    }
  };
  console.log(workDetail);
  console.log(workDetail && workDetail.fileUrlList);
  const maxArr = 8 - (workDetail && workDetail.fileUrlList.length);

  useEffect(() => {
    fetchWorkDetail(id);
  }, [id]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    values: {
      title: workDetail && workDetail.title,
      body: workDetail && workDetail.body,
    },
  });

  useEffect(() => {
    if (workDetail) {
      setCodeIsChecked(workDetail.code);
      setDesignIsChecked(workDetail.design);
      setVideoIsChecked2(workDetail.video);
    }
  }, [workDetail]);

  //~
  const [checkedList, setCheckedList] = useState([]);

  useEffect(() => {
    if (workDetail && workDetail.checkItemList) {
      const updatedCheckedList = workDetail.checkItemList.map((item, index) => {
        const isChecked = checkList.indexOf(item); // 전역으로 정의된 checkList와 비교하여 값이 포함되는지 확인
        return { isChecked }; // workDetail.checkItemList의 인덱스와 전역 checkList의 인덱스 함께 반환
      });
      setCheckedList(updatedCheckedList);
    }
  }, [workDetail, checkList]);

  console.log(checkedList);
  const isCheckedArray = checkedList.map((item) => item.isChecked);
  console.log(isCheckedArray);

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
  };
  const [textLength, setTextLength] = useState(0);
  const handleTextChange = (e) => {
    setTextLength(e.target.value.length);
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

  //~ 썸네일 사진 파일  인풋창
  const [thumbNail, setThumbNail] = useState({ file: null, fileName: "" });
  const handleThumbNail = async (e) => {
    const selectedThumbNailFile = e.target.files[0];
    const selectedThumbNail = { fileName: selectedThumbNailFile ? selectedThumbNailFile.name : "", file: selectedThumbNailFile };

    setThumbNail(selectedThumbNail);
  };

  //~ 사진 미리보기 수정
  const [reThumbNail, setReThumbNail] = useState({ file: null, fileName: "" });

  const handleReThumbNail = (e) => {
    const file = e.target.files[0]; // 선택된 파일 가져오기
    console.log(file);

    const reSelectedThumbNail = { fileName: file ? file.name : "", file: file };
    console.log(reSelectedThumbNail);
    setReThumbNail(reSelectedThumbNail);
    if (file) {
      const reader = new FileReader(); // 파일을 읽을 FileReader 객체 생성
      reader.onload = () => {
        // 이미지를 읽은 후 실행되는 콜백 함수
        const imageDataUrl = reader.result; // 이미지 데이터 URL 가져오기
        console.log(imageDataUrl);
        // 썸네일 이미지 교체
        setWorkDetail({ ...workDetail, thumbNailUrl: imageDataUrl }); // 이미지 URL 목록 업데이트
      };
      reader.readAsDataURL(file); // 파일을 읽기 시작
    }
  };

  //~ 본문 이미지 미리보기 수정
  const [reImg, setReImg] = useState([{ file: null, fileName: "" }]);

  const handleReImg = (e, index) => {
    const file = e.target.files[0]; // 선택된 파일 가져오기
    const updatedFileUrlList = [...workDetail.fileUrlList]; // 기존 파일 URL 리스트 복사
    updatedFileUrlList[index] = { fileName: file ? file.name : "", file: file }; // 선택한 파일을 새로운 URL 리스트에 저장

    // const reSelectedImg =
    console.log(updatedFileUrlList);
    setReImg(updatedFileUrlList);
    console.log(reImg);

    if (file) {
      const reader = new FileReader(); // 파일을 읽을 FileReader 객체 생성
      reader.onload = () => {
        // 이미지를 읽은 후 실행되는 콜백 함수
        const imageDataUrl = reader.result; // 이미지 데이터 URL 가져오기
        console.log(imageDataUrl);
        // 썸네일 이미지 교체
        const updatedFileUrlList = [...workDetail.fileUrlList]; // 기존 파일 URL 리스트 복사
        console.log(updatedFileUrlList);
        updatedFileUrlList[index] = imageDataUrl; // 선택한 파일을 새로운 URL 리스트에 저장
        setWorkDetail({ ...workDetail, fileUrlList: updatedFileUrlList }); // 이미지 URL 목록 업데이트
      };
      reader.readAsDataURL(file); // 파일을 읽기 시작
    }
  };
  console.log(reImg);

  //~사진 삭제
  const [delName, setDelName] = useState([]);

  const handleImageDelete = (index) => {
    const updatedFileUrlList = [...workDetail.fileUrlList];
    const updatedFileNameList = [...workDetail.fileNameList];

    const deletedImageName = updatedFileNameList[index]; // 삭제된 이미지 URL 저장
    alert("사진을 삭제 할까요?");

    updatedFileUrlList.splice(index, 1); // 해당 인덱스의 이미지 URL 제거
    updatedFileNameList.splice(index, 1); // 해당 인덱스의 이미지 Name 제거
    setWorkDetail({ ...workDetail, fileUrlList: updatedFileUrlList, fileNameList: updatedFileNameList }); // 이미지 URL 목록 업데이트
    setDelName([...delName, deletedImageName]);
  };

  // const [thumbNailDel, setThumbNailDel] = useState(workDetail && workDetail.thumbNailUrl);
  const handleThumbNailDelete = () => {
    alert("사진을 삭제 할까요?");

    setWorkDetail({ ...workDetail, thumbNailUrl: "" }); // 이미지 URL 목록 업데이트
  };
  // console.log(workDetail);

  //~드래그 기능
  const [draggedItemId, setDraggedItemId] = useState(null);

  const handleDragStart = (e, id) => {
    setDraggedItemId(id);
    e.dataTransfer.effectAllowed = "move"; //+버튼 지우기
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropZoneId, work) => {
    e.preventDefault();

    // 드래그된 요소를 배열에서 제거합니다.
    const draggedWork = workDetail.fileUrlList[draggedItemId];
    const newWorkData = workDetail.fileUrlList.filter((_, index) => index !== draggedItemId);

    const draggedWorkName = workDetail.fileNameList[draggedItemId];
    const newWorkDataName = workDetail.fileNameList.filter((_, index) => index !== draggedItemId);

    // 드롭된 위치에 드래그된 요소를 삽입합니다.
    const updatedWorkData = [...newWorkData.slice(0, dropZoneId), draggedWork, ...newWorkData.slice(dropZoneId)];
    const updatedWorkDataName = [...newWorkData.slice(0, dropZoneId), draggedWorkName, ...newWorkDataName.slice(dropZoneId)];

    // reImg 상태도 함께 업데이트합니다.
    const updatedReImg = [...reImg.slice(0, dropZoneId), reImg[draggedItemId], ...reImg.slice(dropZoneId, draggedItemId), ...reImg.slice(draggedItemId + 1)];
    setReImg(updatedReImg);

    // 변경된 배열을 상태에 설정합니다.
    setWorkDetail({ ...workDetail, fileUrlList: updatedWorkData, fileNameList: updatedWorkDataName });
    setDraggedItemId(null);
  };

  // const { text, sett } = useState("text");
  const handleBigInputChange = (e) => {
    handleChange(e); // handleChange 함수 호출
    handleBigTextChange(e); // handleBigTextChange 함수 호출
  };
  const handleInputChange = (e) => {
    handleChange(e); // handleChange 함수 호출
    handleTextChange(e); // handleBigTextChange 함수 호출
  };

  const handleThumbImageClick = () => {
    const fileInput = document.getElementById(`thumb`);
    if (fileInput) {
      fileInput.click();
    }
  };
  const handleImageClick = (index) => {
    const fileInput = document.getElementById(`reimg-${index}`);
    if (fileInput) {
      fileInput.click();
    }
  };

  //~ supabase로 보내요
  const { v4: uuidv4 } = require("uuid"); // uuid 모듈을 불러옵니다.
  const onSubmit = async () => {
    try {
      // 기존 이미지 URL들을 가져옵니다.
      const existingImageUrls = workDetail.fileUrlList || [];
      const existingImageNamses = workDetail.fileNameList || [];

      //썸네일
      let thumbNailUrl; // 썸네일 이미지 URL 초기값 설정

      // console.log(thumbNailDel);
      if (!(workDetail.thumbNailUrl === "")) {
        if (reThumbNail.file) {
          // 썸네일 이미지 업로드
          const thumbNailName = `${uuidv4()}`;
          const { data: thumbNailData, error: thumbNailError } = await supabase.storage.from("images").upload(thumbNailName, reThumbNail.file);
          if (thumbNailError) {
            throw thumbNailError;
          }
          const fakethumbNailUrl = await supabase.storage.from("images").getPublicUrl(thumbNailName);
          thumbNailUrl = fakethumbNailUrl.data.publicUrl;
        }
        if (thumbNail.file) {
          //-> 인풋창에 썸네일 사진이 있을때
          // 썸네일 이미지 업로드
          const thumbNailName = `${uuidv4()}`;
          const { data: thumbNailData, error: thumbNailError } = await supabase.storage.from("images").upload(thumbNailName, thumbNail.file);
          if (thumbNailError) {
            throw thumbNailError;
          }
          const fakethumbNailUrl = await supabase.storage.from("images").getPublicUrl(thumbNailName);
          thumbNailUrl = fakethumbNailUrl.data.publicUrl;
        }
      } else {
        thumbNailUrl = "";
        if (thumbNail.file) {
          //-> 인풋창에 썸네일 사진이 있을때
          // 썸네일 이미지 업로드
          const thumbNailName = `${uuidv4()}`;
          const { data: thumbNailData, error: thumbNailError } = await supabase.storage.from("images").upload(thumbNailName, thumbNail.file);
          if (thumbNailError) {
            throw thumbNailError;
          }
          const fakethumbNailUrl = await supabase.storage.from("images").getPublicUrl(thumbNailName);
          thumbNailUrl = fakethumbNailUrl.data.publicUrl;
        }
      }
      // 기존 이미지가 변경되면 변경된 이미지   url을 업로드 합니다
      const uploadedReImages = await Promise.all(
        reImg.map(async (input, index) => {
          if (!input.file) {
            return null; // 이미지가 선택되지 않은 경우 null 반환
          }
          console.log(index);
          const selectedFile = input.file;

          const imageName = `${uuidv4()}`;
          const { data, error } = await supabase.storage.from("images").upload(imageName, selectedFile, { overwrite: true });

          if (error) throw error;
          const imageUrl = await supabase.storage.from("images").getPublicUrl(imageName);
          return (existingImageUrls[index] = imageUrl.data.publicUrl), (existingImageNamses[index] = imageName);
        })
      );

      // 새로 업로드할 이미지 URL들을 업로드합니다.
      const uploadedImages = await Promise.all(
        imageInputs.map(async (input) => {
          if (!input.file) {
            return null; // 이미지가 선택되지 않은 경우 null 반환
          }
          const selectedFile = input.file;

          const imageName = `${uuidv4()}`;
          const { data, error } = await supabase.storage.from("images").upload(imageName, selectedFile, { overwrite: true });

          if (error) throw error;
          const imageUrl = await supabase.storage.from("images").getPublicUrl(imageName);
          return { imageUrl: imageUrl.data.publicUrl, imageName: imageName };
        })
      );

      // null 값을 제거하여 새로운 배열 생성
      const filteredImages = uploadedImages.filter((url) => url !== null);

      const imageUrls = filteredImages.map((image) => image.imageUrl);
      const imageNames = filteredImages.map((image) => image.imageName);

      // 기존 이미지 URL들과 새로 업로드한 이미지 URL들을 합칩니다.
      const allImageUrls = [...existingImageUrls, ...imageUrls];
      const allImageNames = [...existingImageNamses, ...imageNames];

      // 데이터베이스에 삽입할 데이터 준비
      const formDataWithImages = { ...formData, fileUrlList: allImageUrls, fileNameList: allImageNames, thumbNailUrl: thumbNailUrl };

      // 데이터베이스에 데이터 삽입
      const { data: updatedData, error } = await supabase.from("work").update(formDataWithImages).eq("id", id);

      if (error) throw error;

      delName.map(async (imageUrl) => {
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

  return (
    <div>
      <section id="retouchwork">
        <div className="retouchwork__inner">
          <h1 className="retouchwork__title">작업물 수정</h1>
          <button
            className="btnhome"
            onClick={() => {
              movePage("/");
            }}
          >
            <img src={home} alt="" className="homebtn" />
          </button>

          <div className="retouchwork__body">
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
                <div>본문 내용</div> <div style={{ marginLeft: "auto" }}>{textLength} / 50</div>{" "}
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
                    <input className="checkboxs" type="checkbox" id="code" checked={codeIsChecked} onClick={handleCodeCheckboxChange} value={codeIsChecked ? "false" : "true"} name="code" onChange={handleChange} />
                    <label htmlFor="code">개발</label>
                  </div>
                  <div>
                    <input className="checkboxs" type="checkbox" id="design" name="design" checked={designIsChecked} value={designIsChecked ? "false" : "true"} onClick={handleDesignCheckboxChange} onChange={handleChange} />
                    <label htmlFor="design">디자인</label>
                  </div>
                  <div>
                    <input className="checkboxs" type="checkbox" id="video" name="video" checked={videoIsChecked} value={videoIsChecked ? "false" : "true"} onClick={handleVideoCheckboxChange} onChange={handleChange} />
                    <label htmlFor="video">영상</label>
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: "24px" }}>체크</div>
              <div className="checklist">
                <ul>
                  {checkList.map((item, index) => (
                    <li key={index}>
                      <input type="checkbox" id={`checkbox-${index}`} className="checkboxs" style={{ display: "none" }} />
                      <label htmlFor={`checkbox-${index}`}>{item}</label>
                    </li>
                  ))}
                </ul>
              </div>

              {workDetail && workDetail.thumbNailUrl && workDetail.thumbNailUrl.length > 0 ? (
                <div className="thumbnailspace">
                  <div style={{ marginTop: "50px" }}>리스트 이미지 (16:10 비율)</div>

                  <div className="image-container">
                    <input className="btnaddimg" type="file" id="thumb" onChange={handleReThumbNail} />
                    <img src={retouch} className="re-btn" draggable="false" onClick={handleThumbImageClick} />

                    <img draggable="false" src={delbtn} alt="" className="del-btn" onClick={handleThumbNailDelete} />
                    <img src={workDetail && workDetail.thumbNailUrl} alt="" />
                  </div>
                </div>
              ) : (
                ""
              )}

              <div>
                {workDetail && workDetail.fileUrlList && workDetail.fileUrlList.length > 0 ? <div className="workpictitle">본문 이미지</div> : ""}
                {workDetail && workDetail.fileUrlList && workDetail.fileUrlList.length > 0 ? (
                  <div className="workpic">
                    {workDetail &&
                      workDetail.fileUrlList &&
                      workDetail.fileUrlList.map((url, index) => (
                        <div key={index} className="image-container" onDrop={(e) => handleDrop(e, index)} onDragOver={handleDragOver}>
                          <input className="btnaddimg" type="file" id={`reimg-${index}`} onChange={(e) => handleReImg(e, index)} />
                          <img src={retouch} className="re-btn" draggable="false" onClick={() => handleImageClick(index)} />
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
                ) : (
                  ""
                )}
              </div>

              {workDetail && workDetail.thumbNailUrl && workDetail.thumbNailUrl.length > 0 ? (
                ""
              ) : (
                <div>
                  <div>리스트 이미지 (16:10 비율)</div>
                  <div className="filebox">
                    <input type="text" className="upload-name" value={thumbNail ? thumbNail.fileName : ""} readOnly />
                    <label htmlFor="thumbnail" className="btn-upload">
                      찾기
                    </label>
                    <input className="btnaddimg" type="file" name="thumbnail" id="thumbnail" onChange={(e) => handleThumbNail(e)} />
                  </div>
                </div>
              )}

              {imageInputs.slice(0, maxArr).map((input, index) => (
                <div key={index}>
                  <div>추가할 본문 이미지{index + 1}</div>
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
            <button onClick={handleSubmit(onSubmit)} className="ok">
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

export default Retouchwork;

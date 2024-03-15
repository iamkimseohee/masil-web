import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createClient } from "@supabase/supabase-js";
import movebtn from "../assets/img/move.png";
import delbtn from "../assets/img/delbtn.png";

const supabase = createClient(
  "https://qiwrlvedwhommigwrmcz.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY"
);

function Retouchwork() {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const movePage = useNavigate();
  const gouserpage = () => {
    movePage("/userpage");
  };

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
  useEffect(() => {
    if (workDetail) {
      setIsChecked(workDetail.code);
      setIsChecked2(workDetail.design);
    }
  }, [workDetail]);

  //~ 체크박스
  const [isChecked, setIsChecked] = useState("");
  const [isChecked2, setIsChecked2] = useState("");
  console.log(isChecked, isChecked2);
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

  //~ 글자 감지
  const [titleLength, setTitleLength] = useState(0);
  const handleTitleChange = (e) => {
    setTitleLength(e.target.value.length);
    console.log(e.target.value);
  };

  //~ 사진 추출
  const [fileName, setFileName] = useState("");
  const handleFileChange2 = (e) => {
    // const fileName = e.target.value.split("\\").pop(); // 파일 경로에서 파일 이름만 추출
    const selectedFile = e.target.files[0];
    console.log(selectedFile);
    setFileName(selectedFile); // 파일 이름 상태 업데이트
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
  const onSubmit = async (data) => {
    try {
      // 기존 이미지 URL들을 가져옵니다.
      const existingImageUrls = workDetail.fileUrlList || [];

      // 새로 업로드할 이미지 URL들을 업로드합니다.
      const uploadedImages = await Promise.all(
        imageInputs.map(async (input) => {
          console.log(input);
          if (!input.file) {
            return null; // 이미지가 선택되지 않은 경우 null 반환
          }
          const selectedFile = input.file;
          const imageName = `${Date.now()}_${selectedFile.name}`; // 파일 이름 생성
          const { data, error } = await supabase.storage
            .from("images")
            .upload(imageName, selectedFile, { overwrite: true });
          if (error) throw error;
          const imageUrl = await supabase.storage.from("images").getPublicUrl(imageName);
          console.log(imageUrl.data.publicUrl);
          return imageUrl.data.publicUrl;
        })
      );
      console.log(uploadedImages);
      // null 값을 제거하여 새로운 배열 생성
      const filteredImages = uploadedImages.filter((url) => url !== null);

      console.log(filteredImages);

      // 기존 이미지 URL들과 새로 업로드한 이미지 URL들을 합칩니다.
      const allImageUrls = [...existingImageUrls, ...filteredImages];

      // 데이터베이스에 삽입할 데이터 준비
      const formDataWithImages = { ...formData, fileUrlList: allImageUrls };
      console.log(formDataWithImages);

      // 데이터베이스에 데이터 삽입
      const { data: updatedData, error } = await supabase.from("work").update(formDataWithImages).eq("id", id);
      console.log(data, id);
      if (error) throw error;

      console.log("Data inserted successfully:", updatedData);
      // 페이지 이동 등 추가 작업이 필요하다면 이곳에 추가
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleImageDelete = (index) => {
    console.log(index);
    const updatedFileUrlList = [...workDetail.fileUrlList];
    console.log(updatedFileUrlList);
    updatedFileUrlList.splice(index, 1); // 해당 인덱스의 이미지 URL 제거
    setWorkDetail({ ...workDetail, fileUrlList: updatedFileUrlList }); // 이미지 URL 목록 업데이트
  };

  useEffect(() => {
    fetchWorkDetail(id);
  }, [id]);

  return (
    <div>
      <section id="addwork">
        <div className="addwork__inner">
          <h1 className="addwork__title">작업물 수정</h1>
          <div className="addwork__text">
            <form>
              {/* 제목 */}
              <div>큰 제목</div>
              <input
                type="text"
                name="title"
                defaultValue={workDetail && workDetail.title}
                maxLength={15}
                onChange={handleChange}
              />
              {/* 본문 내용 */}
              <div>본문 내용</div>
              <input
                type="text"
                name="body"
                defaultValue={workDetail && workDetail.body}
                maxLength={23}
                onChange={handleChange}
              />
              {/* 분야 */}
              <div className="checkboxline">
                {" "}
                <div>분야</div>
                <div className="worktype">
                  <div>
                    <input
                      type="checkbox"
                      id="code"
                      checked={isChecked}
                      onClick={handleCheckboxChange1}
                      value={isChecked ? "false" : "true"}
                      name="code"
                      onChange={handleChange}
                    />
                    <label htmlFor="code">개발</label>
                  </div>
                  <div>
                    <input
                      type="checkbox"
                      id="design"
                      name="design"
                      checked={isChecked2}
                      value={isChecked2 ? "false" : "true"}
                      onClick={handleCheckboxChange2}
                      onChange={handleChange}
                    />
                    <label htmlFor="design">디자인</label>
                  </div>
                </div>
              </div>
              <div className="workpic">
                {workDetail &&
                  workDetail.fileUrlList &&
                  workDetail.fileUrlList.map((url, index) => (
                    <div key={index} className="image-container">
                      <img onClick={() => handleImageDelete(index)} src={delbtn} alt="" className="del-btn" />
                      <img src={movebtn} alt="" className="move-btn" />
                      <img className="pic" src={url} alt={`Image ${index}`} />
                    </div>
                  ))}
              </div>

              {imageInputs.map((input, index) => (
                <div key={index}>
                  <div>추가할 이미지{index + 1}</div>
                  <div className="filebox">
                    <input type="text" className="upload-name" value={input.file ? input.file.name : ""} readOnly />
                    <label htmlFor={`file-${index}`} className="btn-upload">
                      찾기
                    </label>
                    <input
                      className="btnaddimg"
                      type="file"
                      name={`file-${index}`}
                      id={`file-${index}`}
                      onChange={(e) => handleFileChange(index, e)}
                    />
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

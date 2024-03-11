import React, { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

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

  //~ 체크박스

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

  //file경로 담아둘 list
  const [fileUrlList, setFileUrlList] = useState([]);
  const handleFileChange = async (index, e) => {
    const fileName = e.target.value.split("\\").pop(); // 파일 경로에서 파일 이름만 추출
    const selectedFile = e.target.files[0];

    console.log("fileName 파일이름 🚨", fileName); // 파일 이름
    console.log("selectedFile 선택한 파일 🚨", selectedFile); //선택한 파일
    try {
      // 스토리지에 파일 업로드
      const { data, error } = await supabase.storage.from("images").upload(selectedFile.name, selectedFile);

      if (error) {
        throw error;
      }

      // 업로드한 파일의 공개 URL 가져오기
      const imageUrl2 = supabase.storage.from("images").getPublicUrl(selectedFile.name);
      const imageUrl = imageUrl2.data.publicUrl;

      // 상태 업데이트
      const updatedInputs = [...imageInputs];

      updatedInputs[index] = { fileName: selectedFile.name, file: imageUrl };
      console.log("내가 원하는거(각 파일의 유알엘만", updatedInputs[index].file);

      setImageInputs(updatedInputs); // 칸에 이름 넣어주기 위한것
      console.log(imageInputs);

      // setFileUrlList([...fileUrlList], updatedInputs[index].file);
      // console.log(imageInputs[index - 1].file);
      // const imgUrl = imageInputs[index - 1].file

      // console.log(imageInputs[index].file);
      setFileUrlList((prevFileUrlList) => [...prevFileUrlList, imageUrl]); // 파일 URL 추가
      console.log(fileUrlList);
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }

    setFileName(selectedFile);

    // // 상태 업데이트
    // const updatedInputs = [...imageInputs]; //
    // console.log("updatedInputs 🚨", updatedInputs);
    // updatedInputs[index] = { fileName, file: selectedFile };
    // console.log(" updatedInputs[index] 🚨", index, updatedInputs[index]);

    // setImageInputs(updatedInputs);
  };
  // const [files, setFiles] = useState([]);
  const handleFiles = async (e) => {
    const fileList = e.target.files;
  };

  //~ supabase로 보내요
  // 이미지 넣기
  const onSubmit2 = async () => {
    try {
      const { data, error } = await supabase.storage.from("images").upload(fileName.name, fileName);

      if (error) {
        throw error;
      }

      const imageUrl2 = supabase.storage.from("images").getPublicUrl(fileName.name, fileName);
      const imageUrl = imageUrl2.data.publicUrl;
      // 이미지의 공개 URL을 가져온 후 데이터를 데이터베이스에 삽입합니다.

      await onSubmit(imageUrl);
    } catch (error) {
      console.error("Error inserting data:", error.message);
    }
  };
  // 글들 넣기
  const onSubmit = async (imageUrl) => {
    try {
      // 이미지 URL을 formData에 추가합니다.
      const formDataWithImage = { ...formData, fileUrlList };

      const { data2, error } = await supabase.from("work").insert([formDataWithImage]);

      if (error) {
        throw error;
      }
      console.log("Data inserted successfully:", data2);
    } catch (error) {
      console.error("Error inserting data:", error.message);
    }
  };

  //~ 정보 가져오기
  const [mailDetail, setMailDetail] = useState(null);

  const fetchMailDetail = async (id) => {
    try {
      const { data, error } = await supabase.from("work").select("*").eq("id", id).single();
      console.log("기존", data);

      console.log("기존", typeof data);
      if (error) {
        throw error;
      }
      setMailDetail(data);
    } catch (error) {
      console.error("Error fetching mail detail:", error.message);
    }
  };
  useEffect(() => {
    fetchMailDetail(id);
  }, [id]);

  const [isChecked, setIsChecked] = useState(mailDetail && mailDetail.code);
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
  return (
    <div>
      <section id="addwork">
        <div className="addwork__inner">
          <h1 className="addwork__title">작업물 수정</h1>
          <div className="addwork__text">
            <form onSubmit={handleSubmit(onSubmit2)}>
              {/* 제목 */}
              <div>큰 제목</div>
              <input type="text" name="title" defaultValue={mailDetail && mailDetail.title} maxLength={15} onChange={handleChange} />
              {/* 본문 내용 */}
              <div>본문 내용</div>
              <input type="text" name="body" defaultValue={mailDetail && mailDetail.body} maxLength={23} onChange={handleChange} />
              {/* 분야 */}
              <div className="checkboxline">
                {" "}
                <div>분야</div>
                <div className="worktype">
                  <div>
                    <input type="checkbox" id="code" checked={mailDetail && mailDetail.code} value={isChecked ? "true" : "false"} name="code" onClick={handleCheckboxChange1} onChange={handleChange} />
                    <label htmlFor="code">개발</label>
                  </div>
                  <div>
                    <input type="checkbox" id="design" name="design" checked={mailDetail && mailDetail.code} value={isChecked2 ? "true" : "false"} onClick={handleCheckboxChange2} onChange={handleChange} />
                    <label htmlFor="design">디자인</label>
                  </div>
                </div>
              </div>
              {/* 이미지 */}

              {imageInputs.map((input, index) => (
                <div key={index}>
                  <div>이미지{index + 1}</div>
                  <div className="filebox">
                    <input type="text" className="upload-name" value={input.fileName || ""} readOnly />
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
            <button onClick={gouserpage}>취소</button>
            <button onClick={handleSubmit(onSubmit)}>확인</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Retouchwork;

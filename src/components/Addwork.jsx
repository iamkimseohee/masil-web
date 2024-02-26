import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Addwork() {
  const movePage = useNavigate();
  const [titleLength, setTitleLength] = useState(0);
  const [contentLength, setContentLength] = useState(0);

  const handleTitleChange = (e) => {
    setTitleLength(e.target.value.length);
  };

  const handleContentChange = (e) => {
    setContentLength(e.target.value.length);
  };
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const fileName = e.target.value.split("\\").pop(); // 파일 경로에서 파일 이름만 추출
    setFileName(fileName); // 파일 이름 상태 업데이트
  };
  return (
    <div>
      <section id="addwork">
        <div className="addwork__inner">
          <h1 className="addwork__title">작업물 추가</h1>
          <div className="addwork__text">
            <form>
              <div>큰 제목</div>
              <input type="text" name="name" maxLength={15} onChange={handleTitleChange} />
              <div>본문 내용</div>
              <input type="text" name="name" maxLength={23} />
              <div className="checkboxline">
                {" "}
                <div>분야</div>
                <div className="worktype">
                  <div>
                    <input type="checkbox" id="scales" name="scales" />
                    <label for="scales">개발</label>
                  </div>
                  <div>
                    <input type="checkbox" id="horns" name="horns" />
                    <label for="horns">디자인</label>
                  </div>
                </div>
              </div>

              <div>이미지</div>
              <div className="filebox">
                {" "}
                <input type="text" className="upload-name" value={fileName} readOnly />
                <label for="file" className="btn-upload">
                  찾기
                </label>
                <input className="btn" type="file" name="file" id="file" onChange={handleFileChange} />
              </div>
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
            <button>확인</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Addwork;

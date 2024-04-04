import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { isMobile } from "react-device-detect";
import { createClient } from "@supabase/supabase-js";
import moment from "moment";
import { useState } from "react";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

const Contact = () => {
  const movePage = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const now = moment().format("YYYY.MM.DD HH:mm"); //현재 시간
      const newData = { ...data, time: now };
      // 메일리스트 가져오기
      const { data: blockListData, error: blockListError } = await supabase.from("blockmaillist").select("maillist");
      console.log(blockListData);
      if (blockListError) {
        throw blockListError;
      }

      if (blockListData) {
        // blocklist에서 이메일 주소 배열 가져오기
        const blocklistEmails = blockListData.map((item) => item.maillist);
        console.log(blocklistEmails);

        // data의 email이 blocklistEmails에 있는지 알아보기
        // blocklistEmails 배열에 데이터의 이메일이 포함되어 있는지 확인하고 필터링
        const isBlocked = blocklistEmails.includes(data.email);

        console.log("Is email blocked?", isBlocked);

        // 조건에 따라 테이블 선택하여 데이터 삽입
        if (isBlocked) {
          const { data: insertData, error: insertError } = await supabase.from("blockmail").insert([newData]);
          if (insertError) {
            throw insertError;
          }
          if (isMobile) {
            movePage("/success");
          } else {
            alert("마실에 제안 및 문의 주셔서 감사합니다. 보내주신 내용은 담당자가 검토하여 필요시 회신 드리도록 하겠습니다.");
            // 제출 후에 각 input 요소의 값을 초기화
            document.getElementsByName("name")[0].value = ""; // 이름 입력란 초기화
            document.getElementsByName("email")[0].value = ""; // 이메일 입력란 초기화
            document.getElementsByName("title")[0].value = ""; // 제목 입력란 초기화
            document.getElementsByName("body")[0].value = ""; // 내용 입력란 초기화

            setTitleLength(0); // 내용 입력란 길이 초기화
          }
          console.log("Data inserted into table A:", insertData);
        } else {
          const { data: insertData, error: insertError } = await supabase.from("contact").insert([newData]);
          if (insertError) {
            throw insertError;
          }
          if (isMobile) {
            movePage("/success");
          } else {
            alert("마실에 제안 및 문의 주셔서 감사합니다. 보내주신 내용은 담당자가 검토하여 필요시 회신 드리도록 하겠습니다.");
            // 제출 후에 각 input 요소의 값을 초기화
            document.getElementsByName("name")[0].value = ""; // 이름 입력란 초기화
            document.getElementsByName("email")[0].value = ""; // 이메일 입력란 초기화
            document.getElementsByName("title")[0].value = ""; // 제목 입력란 초기화
            document.getElementsByName("body")[0].value = ""; // 내용 입력란 초기화

            setTitleLength(0); // 내용 입력란 길이 초기화
          }
          console.log("Data inserted into table B:", insertData);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  //~ 글자 감지
  const [titleLength, setTitleLength] = useState(0);
  const handleTitleChange = (e) => {
    setTitleLength(e.target.value.length);
    console.log(e.target.value.length);

    if (titleLength > 1000) {
      alert("1000자까지만 적을수 있습니다 ");
    }
  };

  return (
    <div>
      <section id="contact">
        <div className="contact__inner">
          <h1 className="contact__title">문의</h1>
          <div className="contact__text">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>문의자 이름</div>
              <input type="text" name="name" {...register("name", { required: "이름을 입력하세요" })} maxLength={15} autoComplete="off" />
              {errors.name && <p style={{ color: "red", marginTop: "5px" }}>{errors.name.message}</p>}
              <div className="mailtitle">메일 주소</div>
              <input
                type="email"
                name="email"
                {...register("email", {
                  required: "이메일을 입력하세요",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "이메일 형식에 맞지 않습니다.",
                  },
                })}
                autoComplete="off"
              />
              {errors.email && <p style={{ color: "red", marginTop: "5px" }}>{errors.email.message}</p>}
              <div>제목</div>
              <input type="text" name="title" {...register("title", { required: "제목을 입력하세요" })} maxLength={25} autoComplete="off" />
              {errors.title && <p style={{ color: "red", marginTop: "5px" }}>{errors.title.message}</p>}
              <div className="bodyarea">
                <div className="bodycontent">내용</div>{" "}
                <div className="bodycontent" style={{ marginLeft: "auto" }}>
                  {titleLength}/1000
                </div>
              </div>

              <textarea name="body" {...register("body", { required: "내용을 입력하세요" })} onChange={handleTitleChange} maxLength={1000} autoComplete="off"></textarea>
              {errors.body && <p style={{ color: "red" }}>{errors.body.message}</p>}
              <button type="submit">보내기</button>
            </form>
            <div className="text">
              등록하신 제휴/제안/문의사항은 담당자가 면밀히 검토합니다. <br /> 가능한 빨리 답변을 드리는 것을 원칙으로 하고 있으나 주요 사안의 경우 시간이 조금 더 소요될 수 있습니다. <br />
              제휴/제안/문의사항이 본사 방침과 맞지 않을 경우 답변을 드리지 않을 수 있으며, 관련 내용 및 자료는 즉시 파기됩니다. <br />
              답변은 입력하신 메일 주소로 발송되오니 정확한 주소를 적어주시기 바랍니다.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;

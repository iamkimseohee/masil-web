import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { isMobile } from "react-device-detect";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

const Contact = () => {
  const movePage = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    try {
      const { data: responseData, error } = await supabase.from("contact").insert([data]);
      if (error) {
        throw error;
      }
      console.log("Data inserted successfully:", responseData);
      if (isMobile) {
        movePage("/success");
      } else {
        alert("감사합니다. 마실에 제안 및 문의 주셔서 감사합니다. 보내주신 내용은 담당자가 검토하여 필요시 회신 드리도록 하겠습니다.");
        window.location.reload(); // 페이지 새로고침
      }
    } catch (error) {
      console.error("Error inserting data:", error.message);
    }
  };

  return (
    <div>
      <section id="contact">
        <div className="contact__inner">
          <h1 className="contact__title">문의</h1>
          <div className="contact__text">
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* 이름 */}
              <div>담당자 이름</div>
              <input type="text" name="name" {...register("name", { required: "이름을 입력하세요" })} />
              {errors.name && <p>{errors.name.message}</p>}
              {/* 메일 */}
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
              />
              {errors.email && <p>{errors.email.message}</p>}
              {/* 내용 */}
              <div className="bodycontent">내용</div>
              <textarea name="body" {...register("body", { required: "내용을 입력하세요" })}></textarea>
              {errors.body && <p>{errors.body.message}</p>}
              {/* <input type="file" /> */}
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

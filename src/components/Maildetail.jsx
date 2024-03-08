import React, { useState, useEffect } from "react";
import { Link, NavLink, useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

function Maildetail() {
  const { id } = useParams();
  const [mailDetail, setMailDetail] = useState(null);
  const [prevId, setPrevId] = useState(null);
  const [nextId, setNextId] = useState(null);

  const fetchMailDetail = async (id) => {
    try {
      const { data, error } = await supabase.from("contact").select("*").eq("id", id).single();
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

  const fetchAdjacentIds = async () => {
    try {
      const { data, error } = await supabase.from("contact").select("*").order("id").range(0, 1).gt("id", id).limit(1);
      console.log("다음", typeof data);
      console.log("다음", data[0]);
      if (error) {
        throw error;
      }
      setNextId(data[0]);
    } catch (error) {
      console.error("Error fetching next id:", error.message);
    }

    try {
      const { data, error } = await supabase.from("contact").select("*").order("id", { ascending: false }).range(0, 1).lt("id", id).limit(1);
      console.log("이전", data[0]);
      if (error) {
        throw error;
      }
      setPrevId(data[0]);
    } catch (error) {
      console.error("Error fetching previous id:", error.message);
    }
  };

  useEffect(() => {
    fetchMailDetail(id);
    fetchAdjacentIds();
  }, [id]);

  return (
    <div>
      <div className="maildetail__inner">
        <div className="btnspace">
          <button>삭제</button>
          <button>스팸차단</button>
          <button>답장</button>

          <button>목록</button>
        </div>
        <div>
          {mailDetail && mailDetail.id}
          {mailDetail && mailDetail.name}
          {mailDetail && mailDetail.email}
          {mailDetail && mailDetail.time}
        </div>
        <div>{mailDetail && mailDetail.title}</div>
        <div>{mailDetail && mailDetail.body}</div>
        <div className="btnspace">
          <button>삭제</button>
          <button>스팸차단</button>
          <button>답장</button>

          <button>목록</button>
        </div>
        <div className="prevmail">
          {/* prevId가 null 또는 undefined인 경우에도 프로퍼티 접근을 시도하지만 그런 경우에는 undefined를 반환 */}
          <NavLink to={`/userpage/maildetail/${prevId?.id}`}>
            {prevId && prevId.id}
            {prevId && prevId.name}
            {prevId && prevId.title}
            {prevId && prevId.time}
          </NavLink>
        </div>
        <div className="nextmail">
          <NavLink to={`/userpage/maildetail/${nextId?.id}`}>
            {nextId && nextId.id}
            {nextId && nextId.name}
            {nextId && nextId.title}
            {nextId && nextId.time}
          </NavLink>
        </div>
      </div>
      <div>
        {/* 메일 상세 정보를 표시하는 UI */}
        {/* <div>이전 메일 아이디: {prevId}</div> */}
        <div>현재 메일 아이디: {id}</div>
        {/* <div>다음 메일 아이디: {nextId}</div> */}
      </div>
    </div>
  );
}

export default Maildetail;

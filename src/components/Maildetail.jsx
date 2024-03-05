// import React from "react";
// import { useParams } from "react-router-dom";
// import { createClient } from "@supabase/supabase-js";
// import { useState, useEffect } from "react";

// const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

// function Maildetail() {
//   const [contactData, setContactData] = useState([]);
//   useEffect(() => {
//     fetchContactData();
//   }, []);

//   const fetchContactData = async () => {
//     try {
//       const { data, error } = await supabase.from("contact").select("*");
//       if (error) {
//         throw error;
//       }
//       setContactData(data);
//     } catch (error) {
//       console.error("Error fetching contact data:", error.message);
//     }
//   };
//   let { id } = useParams();
//   // console.log(id);
//   return (
//     <div>
//       <div>메일 세부사항{id}</div>
//       <ul>
//         //{" "}
//         {contactData.map((contact) => (
//           <li key={contact.id}>
//             {/* <input type="checkbox" checked={checkedItems[contact.id] || false} onChange={() => handleCheckboxChange(contact.id)} /> */}
//             <a>
//               Name: {contact.name}, Email: {contact.email}, Message: {contact.body} ,Time: {contact.created_at}
//             </a>
//           </li>
//         ))}
//       </ul>

//       {/* <div>메일 세부사항</div> */}
//     </div>
//   );
// }

// export default Maildetail;

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://qiwrlvedwhommigwrmcz.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpd3JsdmVkd2hvbW1pZ3dybWN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDcyNjk1OTUsImV4cCI6MjAyMjg0NTU5NX0.4YTF03D5i5u8bOXZypUjiIou2iNk9w_iZ8R_XWd-MTY");

function Maildetail() {
  const [mailDetail, setMailDetail] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    fetchMailDetail(id);
  }, [id]);

  const fetchMailDetail = async (id) => {
    try {
      const { data, error } = await supabase.from("contact").select("*").eq("id", id).single(); // Fetch only a single record
      if (error) {
        throw error;
      }
      setMailDetail(data);
    } catch (error) {
      console.error("Error fetching mail detail:", error.message);
    }
  };

  return (
    <div>
      <div>메일 세부사항 {id}</div>
      {mailDetail && (
        <ul>
          <li>
            {mailDetail.id} {mailDetail.name}
            {mailDetail.email}
            {mailDetail.time} <br />
            {mailDetail.title} <br />
            {mailDetail.body}
          </li>
        </ul>
      )}
    </div>
  );
}

export default Maildetail;

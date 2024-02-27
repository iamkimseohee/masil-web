import React from "react";
import { Route, Routes } from "react-router-dom";
import HomeView from "./views/HomeView";

import Mailsuccess from "./components/Mailsuccess";
import Notice from "./components/Notice";
import Addwork from "./components/Addwork";
import Loginpage from "./components/Loginpage";
import Userpage from "./components/Userpage";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/success" element={<Mailsuccess />} />
        <Route path="/addwork" element={<Addwork />} />
        <Route path="contctnotice" element={<Notice />} />
        <Route path="/userpage/*" element={<Userpage />}></Route>
      </Routes>

      {/* <Userpage /> */}

      <div></div>
    </div>
  );
};

export default App;

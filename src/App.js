import React from "react";
import { Route, Routes } from "react-router-dom";
import HomeView from "./views/HomeView";

import Mailsuccess from "./components/Mailsuccess";
// import Notice from "./components/Notice";
import Addwork from "./components/Addwork";
import Loginpage from "./components/Loginpage";
import Userpage from "./components/Userpage";
import Mailpage from "./components/Mailpage";
import Maildetail from "./components/Maildetail";
import Workdetail from "./components/Workdetail";
import Retouchwork from "./components/Retouchwork";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/success" element={<Mailsuccess />} />
        <Route path="/addwork" element={<Addwork />} />
        <Route path="/workdetail/:id" element={<Workdetail />} />
        <Route path="/retouchwork/:id" element={<Retouchwork />} />
        <Route path="/userpage/*" element={<Userpage />}></Route>
      </Routes>

      {/* <Userpage /> */}

      <div></div>
    </div>
  );
};

export default App;

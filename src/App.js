import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomeView from "./views/HomeView";

import Mailsuccess from "./components/Mailsuccess";
import Notice from "./components/Notice";
import Addwork from "./components/Addwork";
import Loginpage from "./components/Loginpage";
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/success" element={<Mailsuccess />} />
        <Route path="/contctnotice" element={<Notice />} />
        <Route path="/addwork" element={<Addwork />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

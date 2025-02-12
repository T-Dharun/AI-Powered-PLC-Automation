import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Workspace from "./pages/Workspace";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Welcome to AI Powered PLC automation</div>} />
        <Route path="/workspace" element={<Workspace/>} />
        <Route path="*" element={<div>fasafddf</div>} />
      </Routes>
    </Router>
  );
}

export default App;

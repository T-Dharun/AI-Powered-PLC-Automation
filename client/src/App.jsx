import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Workspace from "./pages/Workspace";
import Landing from "./pages/Landing";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/workspace" element={<Workspace/>} />
        <Route path="*" element={<div>fasafddf</div>} />
      </Routes>
    </Router>
  );
}

export default App;

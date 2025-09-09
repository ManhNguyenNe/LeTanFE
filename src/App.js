import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import các trang
import LetanDashboard from './pages/LetanDashboard';
import KhamTrucTiep from './pages/KhamTrucTiep';
import XacNhanDatLich from './pages/XacNhanDatLich';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LetanDashboard />} />
          <Route path="/letan" element={<LetanDashboard />} />
          <Route path="/letan/kham-truc-tiep" element={<KhamTrucTiep />} />
          <Route path="/letan/xac-nhan-dat-lich" element={<XacNhanDatLich />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
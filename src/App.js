import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Import các trang
import KhamTrucTiep from './pages/KhamTrucTiep';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<KhamTrucTiep />} />
          <Route path="/letan" element={<KhamTrucTiep />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
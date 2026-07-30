import './App.css'
import React, { useState } from "react";
import Header from './components/Header';
// import YoutubeGrid from './components/YoutubeGrid'
import LeftBar from './components/LeftBar'
import { useEffect } from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage  from './pages/HomePage.tsx';
import  SearchResultsPage  from './pages/SearchResultsPage';
import WatchPage from './pages/WatchPage.tsx';


function App() {

  return (
<>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/watch" element={<WatchPage />} />
    </Routes>
  </BrowserRouter>
</>
  );
}

export default App

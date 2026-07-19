import './App.css'
import React, { useState } from "react";
import Header from './components/Header';
import YoutubeGrid from './components/YoutubeGrid'
import LeftBar from './components/LeftBar'

function App() {
  const [open, setOpen] = useState(false);  return (
    <>
    
    <div className="overlay">
      
        <Header />
        <div className="line-separate-css"></div>
        <LeftBar open={open} toggleSidebar={() => setOpen(!open)} />
    </div>

      <div className="content-css">
        <YoutubeGrid open={open}/>
      </div>
    </>
  )
}

export default App

import './App.css'
import React, { useState } from "react";
import Header from './components/Header';
// import YoutubeGrid from './components/YoutubeGrid'
import LeftBar from './components/LeftBar'
import { useEffect } from 'react';

function App() {

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  useEffect(() => {
      if (window.innerWidth < 768) {
      setSidebarExpanded(false);
    }
  }, []);

      if (window.innerWidth < 768) {
      setSidebarExpanded(false); // Auto-collapse on mobile select
    }
  return (
<>
  <Header 
    onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
/>
  <LeftBar 
          expanded={sidebarExpanded}
/>
  <main className={`pt-16 ${sidebarExpanded ? 'ml-60' : 'ml-16'} p-4`}>
    <p className="text-red-500 font-bold text-2xl">video</p>
  </main>
</>
);
}

export default App

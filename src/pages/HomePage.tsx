import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import VideoGrid from '../components/VideoGrid';
import LeftBar from '../components/LeftBar'

const HomePage = () => {

  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const goHome = () => {
    navigate(`/`);
  }
  const goToSearchResults = (search: String) => {
    // Navigate to a new route with query parameters
    navigate(`/search?q=${search}`);
  };
    useEffect(() => {
      if (window.innerWidth < 768) {
      setSidebarExpanded(false);
    }
    }, []);
  return (
  <>
      <Header
        goHome={goHome}
        onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
        onCustomClick={goToSearchResults}
      />
      <LeftBar
        goHome={goHome}
        expanded={sidebarExpanded}
      />
      
      <main className={`pt-16 ${sidebarExpanded ? 'ml-60' : 'ml-16'} p-4`}>
          {/* <VideoGrid /> */}
      </main>
  </>
);
}
export default HomePage;
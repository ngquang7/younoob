import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
// import YoutubeGrid from './components/YoutubeGrid'
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
    expanded={sidebarExpanded}
/>
  <main className={`pt-16 ${sidebarExpanded ? 'ml-60' : 'ml-16'} p-4`}>
    <p className="text-red-500 font-bold text-2xl">video</p>
  </main>
</>
);
}
export default HomePage;
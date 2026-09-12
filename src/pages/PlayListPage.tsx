import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/navigation/Header';
import LeftBar from '../components/navigation/LeftBar';
import PlayListComponent from '../components/PlayListComponent';

const PlaylistPage = () => {
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  
  const goSearchResults = (search: String) => {
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
        onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
        onCustomClick={goSearchResults}
      />

      <LeftBar

        expanded={sidebarExpanded}
      />
      
      <main className={`pt-16 ${sidebarExpanded ? 'ml-60' : 'ml-16'} p-4`}>
        < PlayListComponent />
      </main>
    </>
  );
}
export default PlaylistPage;
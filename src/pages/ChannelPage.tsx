import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/navigation/Header';
import VideoGrid from '../components/VideoGrid';
import LeftBar from '../components/navigation/LeftBar'
import ChannelComponent from '../components/channel/ChannelComponent';

const ChannelPage = () => {
  const navigate = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [expanded, setExpanded] = useState(true);

  const goSearchResults = (search: string) => {
    // Navigate to a new route with query parameters
    navigate(`/search?q=${search}`);
  };

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      if (width < 1200 && width >= 768) {
        setExpanded(false);
      } else if (width >= 1200) {
        setExpanded(true);
      }
    };

    handleResize(); //Check immediately when loading page
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarExpanded(false);
    }
  }, []);
  const handleToggleSidebar = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <>
      <Header
        onToggleSidebar={handleToggleSidebar}
        onCustomClick={goSearchResults}
      />

      <LeftBar
        expanded={expanded}
      />
      <main className={`pt-16 ${expanded ? 'ml-60' : 'ml-16'} p-4`}>
        <ChannelComponent />
      </main>
    </>
  );
}
export default ChannelPage;
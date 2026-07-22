import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
// import YoutubeGrid from './components/YoutubeGrid'
import LeftBar from '../components/LeftBar'

const SearchResultsPage = () => {
    // const navigate = useNavigate();
const goToSearchResults = (message: string) => {
    // Navigate to a new route with query parameters
    // navigate('/search?q=react');
    console.log('Hello: ${message}');
  };


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
        onCustomClick={goToSearchResults}
    />
    <LeftBar 
            expanded={sidebarExpanded}
    />

    {/* Video grid */}
    <main className={`pt-16 ${sidebarExpanded ? 'ml-60' : 'ml-16'} p-4 bg-white`}>
        <p className="text-red-500 font-bold text-2xl">search</p>
    </main>
    <div>Hello</div>
</>
  );
}

export default SearchResultsPage;
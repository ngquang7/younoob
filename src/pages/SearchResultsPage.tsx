import {useState, useEffect} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
// import YoutubeGrid from './components/YoutubeGrid'
import LeftBar from '../components/LeftBar'



const SearchResultsPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

  const goToSearchResults = (search: String) => {
    console.log("da goi ham goToSearchResults useNavigate");
    // Navigate to a new route with query parameters
    navigate(`/search?q=${search}`);
  };

  const query = searchParams.get('q') || '';

  const handleSearchAgain = (searchTerm: string) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const [sidebarExpanded, setSidebarExpanded] = useState(true);


    useEffect(() => {
      if (window.innerWidth < 768) {
      setSidebarExpanded(false);
    }
    }, []);
  return (
<>
    <Header 
        onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
        onCustomClick={handleSearchAgain}
    />
    <LeftBar 
            expanded={sidebarExpanded}
    />

    {/* Video search */}
    <main className={`pt-16 ${sidebarExpanded ? 'ml-60' : 'ml-16'} p-4 bg-white`}>
        <p className="text-red-500 font-bold text-2xl">YOU ARE searching FOR "{query}"</p>
    </main>
</>
  );
}

export default SearchResultsPage;
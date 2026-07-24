import {useState, useEffect} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
// import YoutubeGrid from './components/YoutubeGrid'
import LeftBar from '../components/LeftBar'
import {searchYouTube, type YouTubeSearchItem} from "../api/youtube.ts";

import axios from "axios";


const SearchResultsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const query = searchParams.get('q') || '';
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  const goHome = () => {
    navigate(`/`);
  }
  const handleSearchAgain = (searchTerm: string) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const [sidebarExpanded, setSidebarExpanded] = useState(true);

    useEffect(() => {
      if (window.innerWidth < 768) {
      setSidebarExpanded(false);
    }
    }, []);

    useEffect( () => {
      const newKeyword: string = searchParams.get("q") ?? "";
      console.log("New search result", newKeyword);
      setKeyword(newKeyword);


      const loadVideos = async () => {
      if(!newKeyword.trim()) {
        return;
      }
      setLoading(true);
      
      try {
        console.log('callingSearchYoutube');
        const data = await searchYouTube(newKeyword);

        console.log("youtube data received:", data.items);
        } 
        catch(error: unknown) {
          console.log("loi ki thuat", error);
          if(axios.isAxiosError(error)) {
          console.error("Youtube API call FAILED:", error.response?.data); 
          }
        } finally {
        setLoading(false);
        }
      }
      loadVideos(); 
    }, [searchParams]);

    useEffect(() => {
      
    }
  )

  return (

<>
    <Header 
        goHome={goHome}
        onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
        onCustomClick={handleSearchAgain}
    />
    <LeftBar 
        expanded={sidebarExpanded}
    />
    {/* Video search */}
    <main className={`pt-16 ${sidebarExpanded ? 'ml-60' : 'ml-16'} p-4 bg-white`}>
        <p className="text-red-500 font-bold text-2xl">YOU ARE SEARCHING FOR "{keyword}"</p>
    </main>
</>
  );
}

export default SearchResultsPage;
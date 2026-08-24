import {useState, useEffect} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import VideoGrid from '../components/VideoGrid';
import LeftBar from '../components/LeftBar'
import {searchYouTube, type YouTubeSearchItem} from "../api/youtubeSearch.ts";
import axios from "axios";
import {videoDetailApi} from  "../api/videoData.ts"

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false); 
  const [videos, setVideos] = useState<YouTubeSearchItem[]>([]);
  const controller = new AbortController();   // Cleanup Function 

  const goHome = () => navigate(`/`);
  const goHistory = () => navigate(`/history`);
  const goWatch = (videoidd: string) => navigate(`/watch?v=${videoidd}`);

  const handleSearchAgain = (searchTerm: string) => {
    navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  /* Sidebar */
  useEffect(() => {
      if (window.innerWidth < 768) {
        setSidebarExpanded(false);
      }
  }, []);

  /* Get and fetch results when keyword in URL change */
  useEffect( () => {
    const newKeyword: string = searchParams.get("q") ?? "";
    setKeyword(newKeyword);
    const loadVideos = async () => {
    if(!newKeyword.trim()) {
      return;
    }
    setLoading(true);
    try {
      console.log('callingSearchYoutube');
      const data = await searchYouTube(newKeyword);
      setVideos(data.items); // Add this, we can set VIDEO
      // 4 key: kind, etag, id, snippet
      } catch(error: unknown) {
        console.log("loi ki thuat", error);
        if(axios.isAxiosError(error)) {
          console.error("Youtube API call FAILED:", error.response?.data); 
        }
      } finally {
      setLoading(false);
      }
    }
    loadVideos();
    return () => {
      controller.abort(); //cleanup: cancel the request when dependencies change or the component unmounts
    };
  }, [searchParams]);

  /* Get like and view from videoDetail Api (haven't done it yet) */
  useEffect( () => {
    const idList = videos.map((video) => {
      //videoId, to get id from video, and convert
      return video.id.videoId;
    })
    // Load detail (like and view) to videos array
    const loadDetail = async () => {
    try {
      console.log('callingSearchYoutube');
      const data1 = await videoDetailApi(idList);
      // Add this, we can set VIDEO
      // 4 key: kind, etag, id, snippet
      } catch(error: unknown) {
        console.log("loi ki thuat", error);
        if(axios.isAxiosError(error)) {
          console.error("Youtube API call FAILED:", error.response?.data); 
        }
      } finally {
      setLoading(false);
      }
    }
  }, [videos])
    
  return (
    <>
      <Header 
          goHome={goHome}
          onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
          onCustomClick={handleSearchAgain}
      />

      <LeftBar
          goHistory={goHistory}
          goHome={goHome}
          expanded={sidebarExpanded}
      />

      {/* Video search */}
      <main className={`pt-16 ${sidebarExpanded ? 'ml-60' : 'ml-16'} p-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3`}>
        {/*Use this to render video  */}
          {videos.map((video) => (
          <VideoGrid
          key={typeof video.id === 'string' ? video.id : video.id.videoId}        
          video={video}
          goWatch={goWatch}
          />
          ))}
      </main>
    </>
  );
}
export default SearchResultsPage;
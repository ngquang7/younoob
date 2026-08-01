import {useState, useEffect} from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import VideoGrid from '../components/VideoGrid';
import LeftBar from '../components/LeftBar'
import {searchYouTube, type YouTubeSearchItem} from "../api/youtubeSearch.ts";
import type { YouTubeListResponse} from "../type";
import axios from "axios";
import type { YouTubeVideo}  from "../type";
import {videoDetailApi} from "../api/videoDetail.ts"

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const query = searchParams.get('q') || '';
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<YouTubeSearchItem[]>([]);
// Cleanup Function 
  const controller = new AbortController();

  const goHome = () => {
    navigate(`/`);
    console.log("go home by HEADER");
  }

  const goWatch = (videoidd: string) => {
    navigate(`/watch?v=${videoidd}`);
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
  // UseEffect to get and fetch results after searching on the searching bar
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

        // Add this, we can set VIDEO
        setVideos(data.items);
        // 4 key: kind, etag, id, snippet

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
      return () => {
      // cleanup: hủy request khi dependency thay đổi hoặc component unmount
      controller.abort();
      };
    }, [searchParams]);

  //Useeffect to get like and view from videoDetail Api
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
    }, [videos])
    
  return (

<>
    <Header 
        goHome={goHome}
        onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
        onCustomClick={handleSearchAgain}
    />
    <LeftBar
        goHome={goHome}
        expanded={sidebarExpanded}
    />
    {/* Video search */}
    <main className={`pt-16 ${sidebarExpanded ? 'ml-60' : 'ml-16'} p-4 bg-black grid grid-cols-3 gap-6 `}>
      {/*Use this to render video  */}
        {videos.map((video) => (
        <VideoGrid
        video={video}
        goWatch={goWatch}
        />
        ))}
    </main>
</>
  );
}
export default SearchResultsPage;
import {useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function HistoryComponent () {
  const [historyList, setHistoryList] = useState<any[]>([]);
  const navigate = useNavigate();

  // Load history when go to this page
  useEffect(() => {
    //Get string string
    const savedHistory = JSON.parse(localStorage.getItem('watch_history') || '[]');
    setHistoryList(savedHistory);
  }, []);

  // Delete 1 video from history
  const removeFromHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Stop event click that navigating page
    const updated = historyList.filter(v => v.id !== id);
    setHistoryList(updated);
    localStorage.setItem('watch_history', JSON.stringify(updated));
  };

  // Clear history
  const clearAllHistory = () => {
    setHistoryList([]);
    localStorage.removeItem('watch_history');
  };

  const getView = (view: string) => {
    const totalView: number = Number(view);
    if(totalView < 1000) return `${view}`;
    if(totalView < 1000000) return `${Math.floor(totalView/1000)}K`; //  K views
    if(totalView < 1000000000) return `${Math.floor(totalView/1000000)}M`; // M views
    if(totalView < 1000000000000) return `${Math.floor(totalView/1000000000)}B`; // B views
  }

  return(
    <div className="mx-auto px-10 py-2 text-white min-h-screen">
      
      {/* Header and clear button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-sans mt-3 ml-3">Watch History</h1>
        {historyList.length > 0 && (
          <button 
            onClick={clearAllHistory}
            className="px-4 py-2 text-xs font-semibold bg-[#212121] hover:bg-[#303030] rounded-full transition cursor-pointer text-gray-300 hover:text-white"
          >
            Clear all watch history
          </button>
        )}
      </div>

      {/* Notification appear if there is no video watched yet. */}
      {historyList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-2">
          <p className="text-lg font-medium">You have no watch history yet.</p>
          <p className="text-sm">Videos you watch will show up here so you can easily find them again.</p>
        </div>
      ) : (
        /* Video in column */
        <div className="flex flex-col gap-3">
          {historyList.map((video) => (
            <div 
              key={video.id} 
              onClick={() => navigate(`/watch?v=${video.id}`)} // Click it, it will navigate to watch page
              className="flex gap-4 cursor-pointer group p-2 hover:bg-[#212121] rounded-xl transition items-start relative"
            >
              {/* Thumbnail */}
              <div className="relative w-40 sm:w-64 aspect-video rounded-xl overflow-hidden bg-gray-800 shrink-0">
                <img 
                  src={video.snippet?.thumbnails?.medium?.url} 
                  alt={video.snippet?.title} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* In4 of video */}
              <div className="flex-1 flex flex-col pr-8">
                <h3 className="font-semibold text-sm sm:text-base line-clamp-2 text-white">
                  {video.snippet?.title}
                </h3>
                <span className="text-xs text-gray-400 mt-1">
                  {video.snippet?.channelTitle} • {video.statistics?.viewCount ? `${getView(video.statistics.viewCount)} views` : ''}
                </span>
              </div>

              {/* X button*/}
              <button 
                onClick={(e) => removeFromHistory(video.id, e)}
                className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white p-2.5 transition rounded-full hover:bg-[#303030]"
                title="Remove from watch history"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
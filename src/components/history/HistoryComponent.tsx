import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../../hooks/storageService';


import HistoryList from './HistoryList';
import ClearHistoryModal from '../common/ClearHistoryModal';


export default function HistoryComponent() {
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [isClearAllHis, setIsClearAllHis] = useState(false);
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<string | null>(null);
  const [isShareModal, setIsShareModal] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [watchLaterVideoList, setWatchLaterVideoList] = useState<any[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedShareVideo, setSelectedShareVideo] = useState<any>(null);
  const filteredHistory = historyList.filter((video) => {
    const title = video.snippet?.title?.toLowerCase() || '';
    const channelTitle = video.snippet?.channelTitle?.toLowerCase() || '';
    const query = searchText.toLowerCase().trim();
    return title.includes(query) || channelTitle.includes(query);
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setSearchText(e.target.value);  /* TEST console.log(`${searchText}`); */

  const showNotice = (message: string) => {
    setNoticeMessage(message);
    setTimeout(() => {
      setNoticeMessage(null);
    }, 2300);
  };

  useEffect(() => {
    const savedWatchLaterVideo = JSON.parse(localStorage.getItem('saved_video') || '[]');
    setWatchLaterVideoList(savedWatchLaterVideo);
  }, []);

  // Load history when go to this page
  useEffect(() => {
    const data = storageService.getHistory() || [];
    setHistoryList(data);
  }, []);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault(); // Stop page refresh
  };

  const handleOpenSaveModal = (video: any) => {
    if (video && video.id) {
      const saveSavedVideos = JSON.parse(localStorage.getItem('saved_video') || '[]');
      const isSaved = saveSavedVideos.some((v: any) => v.id === video.id);
      setIsSaved(isSaved);
    }
  };

  const handleSaveToggle = (video: any) => {
    if (!video || !video.id) return;
    const isNowSaved = storageService.toggleSave(video);
    setWatchLaterVideoList(storageService.getSaved());
    setIsSaved(isNowSaved);
    if (isNowSaved) {
      showNotice(`Saved to Watch Later`);
    } else {
      showNotice(`Removed from Watch Later`);
    }
  };

  const addVideoToList = (video: any) => {
    if (!video.id || !video) return;
    storageService.addToSaved(video);
    const updated = storageService.getSaved();
    setWatchLaterVideoList(updated);
    setIsSaved(true);
    showNotice("Saved to Watch Later");
  };

  // Delete 1 video from history
  const removeFromHistory = (id: string) => {
    storageService.removeHistoryItem(id); // Gọi hàm xóa trong service của bạn
    setHistoryList(prev => prev.filter(item => item.id !== id));
    showNotice("All views of this video removed from history");
  };

  // Clear history
  const clearAllHistory = () => {
    storageService.clearAllHistory();
    setHistoryList([]);
    showNotice("Watch history cleared");
  };

  return (
    <>
      <div className="mx-auto px-15 py-2 text-white min-h-screen">
        {/* Header and clear button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold font-sans mt-3 ml-3">Watch History</h1>

        </div>
        <div className="flex flex-row">

          <div className="mx-auto mr-[430px] py-2 text-white min-h-screen">
            <HistoryList
              historyListLength={historyList.length}
              filteredHistory={filteredHistory}
              activeMenuId={activeMenuId}
              setActiveMenuId={setActiveMenuId}
              selectedVideo={selectedVideo}
              setSelectedVideo={setSelectedVideo}
              watchLaterVideoList={watchLaterVideoList}
              isSaved={isSaved}
              handleSaveToggle={handleSaveToggle}
              handleOpenSaveModal={handleOpenSaveModal}
              showNotice={showNotice}
              setWatchLaterVideoList={setWatchLaterVideoList}
              setIsSaved={setIsSaved}
              removeFromHistory={removeFromHistory}
              isShareModal={isShareModal}
              setIsShareModal={setIsShareModal}
              selectedShareVideo={selectedShareVideo}
              setSelectedShareVideo={setSelectedShareVideo}
            />
          </div>

          {/* RIGHT COLUMN */}
          <aside className="fixed justify-end flex shrink-0 right-10 mt-[10px] rounded-[15px] overflow-hidden">
            <div className="flex flex-col items-start w-[400px] justify-center h-full text-gray-500 bg-[#0f0f0f]">
              {historyList.length > 0 && (
                <>
                  <form
                    onSubmit={handleSubmit}
                    className="flex-1 max-2xl mx-4 hidden md:flex items-center"
                  >
                    <div className="relative flex flex-1 w-[250px] items-center border-b border-[#303030] group px-4">
                      <button
                        className="w-12 h-10 flex items-center justify-center -ml-5 hover:bg-neutral-700 rounded-full transition-colors"
                        // onClick={() => filteredHistory(searchText)}
                        type="submit"
                      >
                        <img
                          src="/public/find.png"
                          className="h-6 w-6"
                        />
                      </button>

                      <input
                        onChange={handleChange}
                        value={searchText}
                        type="text"
                        placeholder="Search watch history"
                        className="w-full bg-transparent text-[#f1f1f1] placeholder-gray-500 text-sm focus:outline-none"
                      />
                      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white scale-x-0 transition-transform duration-150 ease-out origin-center group-focus-within:scale-x-100"></div>

                    </div>

                    {/* Submit (Finding) button */}
                  </form>

                  <button
                    onClick={() => setIsClearAllHis(true)}
                    className="px-4 py-2 text-xs font-semibold bg-[#212121] mt-4 hover:bg-[#303030] rounded-full transition cursor-pointer text-gray-300 hover:text-white"
                  >
                    Clear all watch history
                  </button>

                </>
              )}

              <ClearHistoryModal
                isOpen={isClearAllHis}
                onClose={() => setIsClearAllHis(false)}
                onConfirm={() => {
                  setIsClearAllHis(false);
                  clearAllHistory();
                }}
              />

            </div>
          </aside>
        </div>
      </div>

      {noticeMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-white border border-neutral-700 text-black text-sm font-semibold rounded-xl shadow-2xl transition-all animate-fade-in flex items-center gap-2">
          <span>{noticeMessage}</span>
        </div>
      )}
    </>
  );
}
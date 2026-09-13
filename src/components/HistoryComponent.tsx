import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatView } from '../utils/formatView';
import ShareModal from './common/ShareModal';
import MenuContainer from './common/MenuContainer';
import { storageService } from '../hooks/storageService';

import SaveToPlaylistModal from './common/SaveToPlaylistModal';
import SaveToWatchLater from './common/SaveToWatchLater';

import AddToQueueButton from './menu-button/AddToQueueButton';
import PlaylistButton from './menu-button/PlaylistButton';
import RemoveButton from './menu-button/RemoveButton';
import ShareButton from './menu-button/ShareButton';
import SaveToWatchLaterButton from './menu-button/SaveToWatchLaterButton';

export default function HistoryComponent() {
  const [historyList, setHistoryList] = useState<any[]>([]);
  const [isClearAllHis, setIsClearAllHis] = useState(false);
  const navigate = useNavigate();
  const [activeMenuId, setActiveMenuId] = useState(null);
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

            {/* Notification appear if there is no video watched yet. */}
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-2">
                <p className="text-lg font-medium">You have no watch history yet.</p>
                <p className="text-sm">Videos you watch will show up here so you can easily find them again.</p>
              </div>
            ) : (
              /* Video in column */
              <div className="flex flex-col gap-3">
                {filteredHistory.map((video) => (
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
                        {video.snippet?.channelTitle} • {video.statistics?.viewCount ? `${formatView(video.statistics.viewCount)} views` : ''}
                      </span>
                    </div>

                    {/* X button*/}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === video.id ? null : video.id);
                      }}
                      className="text-xl w-10 h-10 font-bold font-sans cursor-pointer hover:bg-neutral-700 rounded-full transition-colors"

                    >
                      ⋮
                    </button>
                    {activeMenuId === video.id && (
                      <>
                        <MenuContainer onClose={() => setActiveMenuId(null)}>
                          <AddToQueueButton />
                          
                          <SaveToWatchLaterButton
                            video={video}
                            onClose={() => setActiveMenuId(null)}
                            showNotice={showNotice}
                            setWatchLaterVideoList={setWatchLaterVideoList}
                            setIsSaved={setIsSaved}
                          />

                          <PlaylistButton
                            video={video}
                            onClose={() => setActiveMenuId(null)}
                            setSelectedVideo={setSelectedVideo}
                            handleOpenSaveModal={handleOpenSaveModal}
                          />

                          <ShareButton
                            onOpenShareModal={() => {
                              setSelectedShareVideo(video);
                              setIsShareModal(true);
                            }}
                          />
                          <ShareModal
                            isOpen={isShareModal}
                            onClose={() => setIsShareModal(false)}
                            videoId={video?.id || ''}
                            videoTitle={video?.snippet?.title || ''}
                            showNotice={showNotice}
                          />

                          <RemoveButton
                            videoId={video.id}
                            label="Remove from history"
                            onClose={() => setActiveMenuId(null)}
                            remove={removeFromHistory}
                          />
                        </MenuContainer>
                      </>
                    )}

                    {/* SELECTED VIDEO TO OPERATE. FOR EX: DELETE, ADD, SHARE */}
                    {selectedVideo?.id === video.id && (
                      <>
                        <SaveToPlaylistModal
                          onClose={() => setSelectedVideo(null)}
                        >
                          <SaveToWatchLater
                            watchLaterVideoList={watchLaterVideoList}
                            isSaved={isSaved}
                            onToggleSave={() => handleSaveToggle(selectedVideo)}
                          />
                        </SaveToPlaylistModal>

                      </>
                    )}  {/*Selected Video*/}

                  </div>

                ))}

              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <aside className="fixed justify-end flex shrink-0 right-10 mt-[10px] bg-zinc-900 border-r border-zinc-800 rounded-[15px] overflow-hidden">
            <div className="flex flex-col items-start w-[400px] justify-center h-full text-gray-500 bg-gradient-to-b from-[#5c241c] via-[#241517] to-[#121212]">
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

              {isClearAllHis && (
                <div
                  onClick={() => setIsClearAllHis(false)}
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                >
                  {/* Size of padding */}
                  <div onClick={(e) => e.stopPropagation()}
                    className="bg-[#212121] flex-col text-white max-w-[80vh] max-h-[80vh] flex items-center rounded-2xl p-6 shadow-2xl relative [scrollbar-width:none]"
                  >
                    {/* Title: Unsubribe from {channel name} */}
                    <div className="text-white text-xl w-full mb-5 text-left">
                      Clear watch history?
                    </div>
                    <p className="text-gray-400 text-sm text-left flex w-full mb-5">
                      Your YouTube watch history will be cleared from all YouTube apps on all devices.</p>
                    <p className="text-gray-400 text-sm text-left leading-relaxed">
                      Your video recommendations will be reset, but may still be influenced by activity on other Google products. To learn more, visit{' '}
                      <a
                        href="https://myactivity.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3ea6ff] hover:underline"
                      >
                        My Activity
                      </a>
                      .
                    </p>

                    {/* 2 buttons: Cancle and Unsubcribe */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setIsClearAllHis(false)}
                        className="px-4 py-2 mt-5 ml-10 flex hover:bg-[#303030] text-white text-sm font-semibold rounded-full transition cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        className="px-4 py-2 mt-5 flex items-end hover:bg-[#303030] text-blue-500 text-sm font-semibold rounded-full transition cursor-pointer"
                        onClick={() => {
                          setIsClearAllHis(false);
                          clearAllHistory();
                        }}
                      >
                        Clear watch history
                      </button>
                    </div>
                  </div>
                </div>
              )}
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
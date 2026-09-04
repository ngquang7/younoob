import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


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
    //Get string string
    const savedHistory = JSON.parse(localStorage.getItem('watch_history') || '[]');
    setHistoryList(savedHistory);
  }, []);

  const handleOpenSaveModal = (video: any) => {
    if (video && video.id) {
      const saveSavedVideos = JSON.parse(localStorage.getItem('saved_video') || '[]');
      const isSaved = saveSavedVideos.some((v: any) => v.id === video.id);
      setIsSaved(isSaved);
    }
  };
  const handleSaveToggle = (video: any) => {
    if (!video || !video.id) return;
    const existingSavedVideos = JSON.parse(localStorage.getItem('saved_video') || '[]');
    const isAlreadySaved = existingSavedVideos.some((v: any) => v.id === video.id);

    let updatedSavedVideos;
    if (isAlreadySaved) {
      updatedSavedVideos = existingSavedVideos.filter((v: any) => v.id !== video.id);
      setIsSaved(false);
      showNotice(`Removed from Watch Later`);
    } else {
      updatedSavedVideos = [video, ...existingSavedVideos];
      setIsSaved(true);
      showNotice(`Saved to Watch Later`);
    }
    localStorage.setItem('saved_video', JSON.stringify(updatedSavedVideos));
  };
  const shareToFacebook = (video: any) => {
    if (!video || !video.id) return;
    const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(youtubeUrl)}`;
    window.open(facebookShareUrl, '_blank');
  };

  const shareToX = (video: any) => {
    if (!video || !video.id) return;
    const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;
    // "replace(/\s*\(playlist\)/gi, '').trim()" delete (playlist) 
    const text = encodeURIComponent(video.snippet?.title ? `${video.snippet?.title.replace(/\s*\(playlist\)/gi, '').trim()}` : '');
    const xShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(youtubeUrl)}&text=${text}`;
    window.open(xShareUrl, '_blank');
  }

  const shareToLinkedin = (video: any) => {
    if (!video || !video.id) return;
    const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;
    const linkedinShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(youtubeUrl)}`;
    window.open(linkedinShareUrl, '_blank');
  }

  const shareToReddit = (video: any) => {
    if (!video || !video.id) return;
    const youtubeUrl = `https://www.youtube.com/watch?v=${video.id}`;
    // "replace(/\s*\(playlist\)/gi, '').trim()" delete (playlist) 
    const text = encodeURIComponent(video.snippet?.title ? `${video.snippet?.title.replace(/\s*\(playlist\)/gi, '').trim()}` : '');
    const redditShareUrl = `https://reddit.com/submit?url=${encodeURIComponent(youtubeUrl)}&title=${text}`;
    window.open(redditShareUrl, '_blank');
  }
  const handleCopyURL = (video: any) => {
    const shareUrl = `https://youtube.com/watch?v=${video.id}`;
    try {
      navigator.clipboard.writeText(shareUrl);
      showNotice("Copy successfully")
    } catch (error) {
      console.warn("Copy failed ", error);
    }
  };


  const addVideoToList = (video: any) => {
    if (!video.id || !video) return;
    const existingListVideos = JSON.parse(localStorage.getItem('saved_video') || '[]');
    const isAlreadyInList = existingListVideos.some((v: any) => v.id === video.id);
    if (!isAlreadyInList) {
      const updateList = [video, ...existingListVideos];
      localStorage.setItem('saved_video', JSON.stringify(updateList));
    }
    showNotice(`Saved to Watch Later`);
  };

  // Delete 1 video from history
  const removeFromHistory = (id: string) => {
    const updated = historyList.filter(v => v.id !== id);
    setHistoryList(updated);
    localStorage.setItem('watch_history', JSON.stringify(updated));
    showNotice(`All views of this video removed from history`);
  };

  // Clear history
  const clearAllHistory = () => {
    setHistoryList([]);
    localStorage.removeItem('watch_history');
  };

  const getView = (view: string) => {
    const totalView: number = Number(view);
    if (totalView < 1000) return `${view}`;
    if (totalView < 1000000) return `${Math.floor(totalView / 1000)}K`; //  K views
    if (totalView < 1000000000) return `${Math.floor(totalView / 1000000)}M`; // M views
    if (totalView < 1000000000000) return `${Math.floor(totalView / 1000000000)}B`; // B views
  }

  return (
    <div className="mx-auto px-10 py-2 text-white min-h-screen">

      {/* Header and clear button */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-sans mt-3 ml-3">Watch History</h1>
        {historyList.length > 0 && (
          <button
            onClick={() => setIsClearAllHis(true)}
            // onClick={clearAllHistory}
            className="px-4 py-2 text-xs font-semibold bg-[#212121] hover:bg-[#303030] rounded-full transition cursor-pointer text-gray-300 hover:text-white"
          >
            Clear all watch history
          </button>
        )}
      </div>
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
                  <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuId(null);
                    }}
                  />

                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="overflow-hidden absolute right-0 mt-12 w-64 bg-[#282828] overflow-hidden text-white rounded-xl shadow-2xl py-2 z-50 text-sm border-neutral-700"
                  >
                    <button
                      className="w-full px-4 py-2 flex items-center -mt-2 cursor-pointer hover:bg-neutral-700 transition-colors text-left rounded-t-xl">
                      <img
                        alt="Add to queue"
                        src="/public/addtoqueue.png" className="h-6 w-6 mr-3"
                      />
                      Add to queue
                    </button>

                    <button
                      onClick={(e) => {
                        setActiveMenuId(null);
                        addVideoToList(video);
                      }}
                      className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left">
                      <img
                        alt="Save to watch later"
                        src="/public/savetowatchlater.png" className="h-6 w-6 mr-3"
                      />
                      Save to watch later
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(null);
                        setSelectedVideo(video);
                        handleOpenSaveModal(video);
                      }}
                      className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left">
                      <img
                        alt="Save to playlist"
                        src="/public/savetoplaylist.png" className="h-6 w-5 mr-3"
                      />
                      Save to playlist
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsShareModal(true);
                      }}
                      className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left">
                      <img
                        alt="Share"
                        src="/public/share.png" className="h-5 w-5 mr-3"
                      />
                      Share
                    </button>
                    {isShareModal && (
                      <div
                        onClick={() => setIsShareModal(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center cursor-default bg-black/50"
                      >
                        {/* Khung chứa nội dung bảng (Màu nền tối giống YouTube, có bo góc và cuộn khi dài) */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="bg-[#212121] text-white w-[400px] max-h-[80vh] overflow-y-auto rounded-2xl p-6 shadow-2xl relative [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-[#555] [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
                          {/* Nút Đóng (Dấu X góc trên bên phải) */}
                          <button
                            onClick={() => setIsShareModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl w-10 h-10 rounded-full cursor-pointer"
                          >
                            ✕
                          </button>
                          <h2 className="text-xl font-bold mb-6 flex items-center justify-center">
                            Share
                          </h2>
                          <div className="flex flex-row gap-3">
                            <button
                              className="flex flex-col cursor-pointer"
                              onClick={() => shareToFacebook(video)}
                            >
                              <img
                                alt="Share"
                                src="/public/facebook.png"
                                className="rounded-full object-cover h-15 w-15 mb-2 cursor-pointer"
                              />
                              Facebook
                            </button>
                            <button
                              className="flex flex-col cursor-pointer"
                              onClick={() => { shareToX(video) }}
                            >
                              <img
                                src="/public/X.png"
                                className="rounded-full object-cover h-17 w-18 cursor-pointer"
                              />
                              X
                            </button>

                            <button
                              className="flex flex-col cursor-pointer -ml-2"
                              onClick={() => { shareToLinkedin(video) }}
                            >
                              <img
                                src="/public/linkedin.png"
                                className="rounded-full object-cover h-17 w-18 cursor-pointer"
                              />
                              Linked
                            </button>

                            <button
                              className="flex flex-col cursor-pointer"
                              onClick={() => { shareToReddit(video) }}
                            >
                              <img
                                src="/public/reddit.png"
                                className="rounded-full object-cover mb-2 h-15 w-15 cursor-pointer"
                              />
                              Reddit
                            </button>
                          </div>
                          <div className="flex items-center bg-[#1f1f1f] border border-neutral-700 rounded-xl p-2 max-w-md mt-5">
                            {/* <div className="mt-10 bg-black h-15 rounded-[10px] overflow-x-auto whitespace-nowrap w-full text-white"> */}
                            <input
                              type="text"
                              readOnly
                              value={`https://youtube.com/watch?v=${video.id}`}
                              onClick={(e) => e.currentTarget.select()}
                              className="w-full bg-transparent text-white text-sm px-3 outline-none cursor-text select-all truncate selection:bg-blue-600"
                            />

                            <button
                              onClick={() => {
                                handleCopyURL(video)
                              }}
                              className="bg-white hover:bg-neutral-200 text-black font-medium px-4 py-2 rounded-full text-sm transition-colors whitespace-nowrap ml-2 cursor-pointer"
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromHistory(video.id);
                      }}
                      className="w-full px-4 py-2 flex items-center cursor-pointer hover:bg-neutral-700 transition-colors text-left rounded-b-xl"
                    >
                      <img
                        alt="Add to queue"
                        src="/public/bin.png" className="h-5 w-5 mr-3 pointer-events-none"
                      />
                      Remove from history
                    </button>
                  </div>

                </>
              )}
              {/* SELECTED VIDEO TO OPERATE. FOR EX: DELETE, ADD, SHARE */}
              {selectedVideo?.id === video.id && (
                <>
                  <div
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedVideo(null); // Close modal when click outside modal
                    }}
                  />
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="overflow-hidden absolute right-0 mt-12 w-[400px] cursor-default bg-[#282828] text-white rounded-xl shadow-2xl py-2 z-50 text-sm"
                  >
                    <div className="px-4 py-2 text-[17px] font-bold mb-6">Save to...</div>
                    {/* Add Video To List */}
                    <div className="w-full px-5 py-2 flex items-center -mt-4 cursor-pointer hover:bg-neutral-700 transition-colors text-left">
                      <div
                        onClick={() => handleSaveToggle(video)}
                        className="relative group">
                        {/*  */}
                        {watchLaterVideoList.length > 0 ? (
                          <>
                            <div className="flex flex-row">
                              <div className="relative w-28 h-8 flex-shrink-0">
                                <div className="absolute -top-2 left-3 right-2 h-8 w-[55px] bg-[#737373] rounded-md"></div>

                                <img
                                  src={watchLaterVideoList[0]?.snippet?.thumbnails?.medium?.url}
                                  className="h-[35px] w-[65px] absolute ml-2 inset-0 rounded-md overflow-hidden border border-black/40 flex items-center justify-center"
                                />
                              </div>

                              <div className="flex flex-col -ml-6 -mt-1">
                                <span className="text-sm font-medium">Watch later</span>
                                <span className="text-xs text-neutral-400">Private</span>
                              </div>
                              <div className="ml-[170px] text-neutral-300">
                                {isSaved ?
                                  <>
                                    <img
                                      src="/public/savedVideo.png" className="h-6 w-5"
                                    />
                                  </>
                                  :
                                  <>
                                    <img
                                      src="/public/savetoplaylist.png" className="h-6 w-5"
                                    />
                                  </>
                                }
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex flex-row">
                              <div className="relative w-28 h-8 flex-shrink-0">
                                <div className="absolute -top-2 left-3 right-2 h-8 w-[55px] bg-[#737373] rounded-md"></div>

                                <img
                                  src="/loading1.png"
                                  className="h-[35px] w-[65px] absolute ml-2 inset-0 rounded-md overflow-hidden border border-black/40 flex items-center justify-center"
                                />
                              </div>


                              <div className="flex flex-col -ml-6 -mt-1">
                                <span className="text-sm font-medium">Watch later</span>
                                <span className="text-xs text-neutral-400">Private</span>
                              </div>
                              <div className="ml-[170px] text-neutral-300">
                                {isSaved ?
                                  <>
                                    <img
                                      src="/public/saved.png" className="h-6 w-5"
                                    />
                                  </>
                                  :
                                  <>
                                    <img
                                      src="/public/savetoplaylist.png" className="h-6 w-5"
                                    />
                                  </>
                                }

                              </div>
                            </div>
                          </>
                        )} {/* watchLaterVideoList, render the first element and check whether this video has been saved */}
                      </div>
                    </div>
                  </div>
                </>
              )}  {/*Selected Video*/}
            </div>

          ))}

        </div>
      )}
      {noticeMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-4 py-2 bg-white border border-neutral-700 text-black text-sm font-semibold rounded-xl shadow-2xl transition-all animate-fade-in flex items-center gap-2">
          <span>{noticeMessage}</span>
        </div>
      )}
    </div>
  );
}
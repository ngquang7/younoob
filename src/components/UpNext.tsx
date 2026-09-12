import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ShareModal from './common/ShareModal';
import UpNextMenu from './video/UpNextMenu';
import PlaylistMenu from './video/PlaylistMenu';
interface SidebarProps {
  listId: string | null;
  listType: boolean;
  playListVideo: any[];
  upNextVideos: any[];
  videoId: string | null;
  activeMenuId: string | null;
  setActiveMenuId: (id: string | null) => void;
  goWatch: (id: string) => void;
  getTimeago: (date: string) => string;
  addVideoToList: (video: any) => void;
  removeVideoFromList: (id: string) => void;
  watchLaterVideoList: any[];
  handleSaveToggleUpNext: (video: any) => void;
  currentVideo: any;
}

export default function UpNext({
  listId,
  listType,
  playListVideo,
  upNextVideos,
  videoId,
  activeMenuId,
  setActiveMenuId,
  goWatch,
  getTimeago,
  addVideoToList,
  removeVideoFromList,
  watchLaterVideoList,
  handleSaveToggleUpNext,
  currentVideo,
}: SidebarProps) {
  const navigate = useNavigate();
  const [isShareModalUpNext, setIsShareModalUpNext] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [shareVideoTarget, setShareVideoTarget] = useState<{ id: string; title: string } | null>(null);

  const isPlaylistMode = listId === 'LL' || listId === 'WL';

  return (
    <>
      {!isPlaylistMode && (
        <h3 className="font-sans font-semibold text-sm text-gray-400 mb-1 px-1">
          Up Next
        </h3>
      )}

      {isPlaylistMode ? (
        <div className="flex flex-col gap-3 rounded-xl border border-gray-700 mr-3">
          <div className="bg-[#212121] p-3 rounded-xl border border-[#303030]">
            <h3 className="font-sans font-bold text-xl text-white">
              {listType ? 'Watch Later' : 'Liked videos'}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Private • Playlist • {playListVideo.length} videos
            </p>
          </div>

          {playListVideo.map((item, index) => (
            <div
              key={item.id}
              onClick={() =>
                navigate(`/watch?v=${item.id}&list=${listId}&index=${index + 1}`)
              }
              className={`flex gap-3 group cursor-pointer p-1.5 -mb-2 transition ${item.id === videoId ? 'bg-gray-700' : 'hover:bg-[#1c1c1c]'
                }`}
            >
              <span className="text-xs text-gray-400 flex items-center justify-center shrink-0 font-medium">
                {index + 1}
              </span>

              <div className="relative w-[90px] h-[55px] flex items-center aspect-video rounded-md overflow-hidden shrink-0 bg-[#212121]">
                <img
                  src={
                    item?.snippet?.thumbnails?.medium?.url ||
                    item?.snippet?.thumbnails?.default?.url
                  }
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 flex flex-col gap-1 py-0.5">
                <h4 className="text-xs font-semibold leading-snug line-clamp-3 text-[#f1f1f1] group-hover:text-white">
                  {item?.snippet?.title?.length > 45
                    ? item.snippet.title.slice(0, 45) + '...'
                    : item?.snippet?.title}
                </h4>
                <span className="text-[12px] text-gray-400 truncate">
                  {item?.snippet?.channelTitle}
                </span>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const vidId = item.id;
                  setActiveMenuId(activeMenuId === vidId ? null : vidId);
                }}
                className="hidden text-xl group-hover:block cursor-pointer top-20 w-[30px] h-[30px] hover:text-white"
              >
                ⋮
              </button>

              <PlaylistMenu
                item={item}
                listType={listType}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
                addVideoToList={addVideoToList}
                removeVideoFromList={removeVideoFromList}
                setShareVideoTarget={setShareVideoTarget}
                setIsShareModalUpNext={setIsShareModalUpNext}
              />
            </div>
          ))}

          <div className="text-s text-gray-400 mt-0.5 flex items-center justify-center">
            {listType
              ? 'Xem video da luu free, ko quang cao'
              : 'Nghe nhac free, ko quang cao !'}
          </div>
        </div>
      ) : (
        <>
          {upNextVideos.map((video) => {
            const vId = video.id?.videoId || video.id;
            return (
              <div
                key={vId}
                onClick={() => {
                  if (vId) {
                    goWatch(vId);
                  }
                }}
                className="flex gap-3 group w-full cursor-pointer hover:bg-gray-900 relative"
              >
                <div className="relative w-[200px] aspect-video rounded-lg overflow-hidden shrink-0 bg-[#212121]">
                  <img
                    src={video?.snippet?.thumbnails?.default?.url || "null"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-1 py-0.5">
                  <h4 className="text-sm font-semibold leading-snug line-clamp-3 w-full text-[#f1f1f1] group-hover:text-white transition-colors">
                    {video?.snippet?.title || "Loading"}
                  </h4>
                  <div className="flex flex-col gap-0.5 font-medium text-gray-400">
                    <span className="truncate text-[12px]">
                      {video?.snippet?.channelTitle || "Loading"}
                    </span>
                    <div className="flex items-center truncate">
                      <span className="text-[12px]">
                        {getTimeago(video?.snippet?.publishedAt)}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenuId(activeMenuId === vId ? null : vId);
                  }}
                  className="hidden text-l group-hover:block absolute right-1 cursor-pointer top-20 w-[30px] h-[30px] hover:bg-[#383838] rounded-full text-white shadow-md transition"
                >
                  ⋮
                </button>
                <UpNextMenu
                  video={video}
                  vId={vId}
                  activeMenuId={activeMenuId}
                  setActiveMenuId={setActiveMenuId}
                  addVideoToList={addVideoToList}
                  setSelectedVideo={setSelectedVideo}
                  setShareVideoTarget={setShareVideoTarget}
                  setIsShareModalUpNext={setIsShareModalUpNext}
                />
                
                {selectedVideo === video && (
                  <>
                    <div
                      className="fixed inset-0 z-40 cursor-default"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVideo(null);
                      }}
                    />
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="overflow-hidden absolute right-0 mt-12 w-[400px] cursor-default bg-[#282828] text-white rounded-xl shadow-2xl py-2 z-50 text-sm"
                    >
                      <div className="px-4 py-2 text-[17px] font-bold mb-6">
                        Save to...
                      </div>

                      <div className="w-full px-5 py-2 flex items-center -mt-4 cursor-pointer hover:bg-neutral-700 transition-colors text-left">
                        <div
                          onClick={() => handleSaveToggleUpNext(video)}
                          className="relative group w-full"
                        >
                          <div className="flex flex-row items-center justify-between w-full">
                            <div className="flex flex-row items-center gap-3">
                              <div className="relative w-28 h-8 flex-shrink-0">
                                <div className="absolute -top-1 left-3 right-2 h-8 w-[55px] bg-[#737373] rounded-md"></div>
                                <img
                                  src={
                                    watchLaterVideoList[0]?.snippet?.thumbnails
                                      ?.medium?.url ||
                                    watchLaterVideoList[0]?.snippet?.thumbnails
                                      ?.default?.url ||
                                    '/loading1.png'
                                  }
                                  className="h-[35px] w-[65px] absolute ml-2 inset-0 rounded-md object-cover border border-black/40"
                                />
                              </div>

                              <div className="flex flex-col -mt-1">
                                <span className="text-sm font-medium">
                                  Watch later
                                </span>
                                <span className="text-xs text-neutral-400">
                                  Private
                                </span>
                              </div>
                            </div>
                            <div className="text-neutral-300 pr-2">
                              {watchLaterVideoList.some(
                                (v: any) =>
                                  (typeof v.id === 'object' ? v.id.videoId : v.id) ===
                                  vId
                              ) ? (
                                <img
                                  src="/public/savedVideo.png"
                                  className="h-6 w-5"
                                />
                              ) : (
                                <img
                                  src="/public/savetoplaylist.png"
                                  className="h-6 w-5"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </>
      )}

      <ShareModal
        isOpen={isShareModalUpNext}
        onClose={() => setIsShareModalUpNext(false)}
        videoId={shareVideoTarget?.id || currentVideo?.id || ''}
        videoTitle={shareVideoTarget?.title || currentVideo?.snippet?.title || ''}
      />
    </>
  );
}
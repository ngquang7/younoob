import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatTimeAgo } from '../utils/formatTimeAgo';

interface CommentSectionProps {
  comments: any[];
  setComments: React.Dispatch<React.SetStateAction<any[]>>;
  commentText: string;
  setCommentText: (text: string) => void;
  isAddComment: boolean;
  setIsAddComment: (val: boolean) => void;
  commentCount: string;
  video: any;
  setVideo: React.Dispatch<React.SetStateAction<any>>;

}

export default function CommentSection({
  comments,
  setComments,
  commentText,
  setCommentText,
  isAddComment,
  setIsAddComment,
  commentCount,
  video,
  setVideo
  
}: CommentSectionProps) {
  const navigate = useNavigate();
  const [previewImage, setPreviewImage] = useState<string | null>(null);


  const handlePostComment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        const newComment = {
            id: Date.now().toString(),
            snippet: {
                topLevelComment: {
                    snippet: {
                        authorDisplayName: "Quang (You)",
                        authorProfileImageUrl: "/public/Q.png",
                        textDisplay: commentText,
                        publishedAt: new Date().toISOString(),
                        likeCount: 0
                    }
                }
            }
        };
        setComments([newComment, ...comments]);
        if (video && video.statistics) {
            const currentCount = Number(video.statistics.commentCount || 0);
            setVideo({
                ...video,
                statistics: {
                    ...video.statistics,
                    commentCount: String(currentCount + 1)
                }
            });
        }
        setCommentText("");
        setIsAddComment(false);
    };
  return (
    <div className="mt-6">
      <div className="flex items-center gap-2 mb-6">
        <h1 className="text-base font-bold tracking-tight font-sans">
          {commentCount || "Loading..."} Comments
        </h1>
      </div>

      <form onSubmit={handlePostComment} className="flex gap-3 mb-6">
        <div className="w-9 h-9 rounded-full bg-[#392937] overflow-hidden shrink-0 flex items-center justify-center font-sans font-bold text-sm text-white">
          Q
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <input
            type="text"
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onClick={() => setIsAddComment(true)}
            placeholder="Add a comment..."
            className="w-full bg-transparent border-b border-[#303030] focus:border-white focus:outline-none py-1.5 text-sm text-[#f1f1f1] transition-colors placeholder-gray-500"
          />
          <div className="flex justify-end gap-2 animate-in fade-in duration-100">
            {isAddComment && (
              <>
                <button
                  onClick={() => {
                    setIsAddComment(false);
                    setCommentText("");
                  }}
                  type="button"
                  className="px-3.5 py-1.5 text-xs font-semibold bg-black-500 hover:bg-gray-800 rounded-full text-white transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 text-xs font-semibold bg-blue-500 hover:bg-blue-600 rounded-full text-white transition cursor-pointer"
                >
                  Comment
                </button>
              </>
            )}
          </div>
        </div>
      </form>

      {comments.map((item) => {
        const comment = item.snippet.topLevelComment.snippet;
        return (
          <div key={item.id} className="flex gap-4">
            <img
              src={comment.authorProfileImageUrl}
              className="w-10 h-10 rounded-full cursor-pointer object-cover"
              alt="avatar"
              onClick={() => setPreviewImage(comment.authorProfileImageUrl)}
            />
            <div className="flex flex-col mb-8">
              <div className="flex items-center gap-2">
                <span
                  className="font-semibold text-sm cursor-pointer hover:underline"
                  onClick={() => {
                    navigate(`/channel/${comment.authorChannelId?.value || ''}`);
                  }}
                >
                  {comment.authorDisplayName}
                </span>
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(comment.publishedAt)}
                </span>
              </div>
              <p
                dangerouslySetInnerHTML={{ __html: comment.textDisplay }}
                className="text-sm mt-1 text-gray-200"
              />
              <div className="flex items-center mt-2">

                <span className="text-xs text-gray-400 flex flex-row">
                  <button
                    className="w-7 h-7 flex items-center justify-center cursor-pointer rounded-full hover:bg-neutral-700 transition-colors text-left">
                  <img 
                    src="/public/notlike.png"
                    className="h-4 w-4"
                  />
                  </button>
                  <span className="mt-1.5">{comment.likeCount == 0 ? '' : `${comment.likeCount}`}</span>
                </span>


              </div>
            </div>
            {previewImage && (
              <div
                className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                onClick={() => setPreviewImage(null)}
              >
                <img
                  src={previewImage}
                  alt="Preview Large"
                  className="w-200 h-200 rounded-full object-cover shadow-lg border-4 border-gray-600"
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
import React from 'react';

interface SaveToPlaylistModalProps {
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

export default function SaveToPlaylistModal({onClose, children, className = "mt-12" }: SaveToPlaylistModalProps) {


  return (
    <>
      <div
        className="fixed inset-0 z-40 cursor-default"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className={`overflow-hidden absolute right-0 w-[400px] cursor-default bg-[#282828] text-white rounded-xl shadow-2xl py-2 z-50 text-sm ${className}`}
      >
        <div className="px-4 py-2 text-[17px] font-bold mb-4">Save to...</div>
        {children}
      </div>
    </>
  );
}
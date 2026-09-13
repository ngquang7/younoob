import React from 'react';

interface MenuContainerProps {
  onClose: () => void;
  children: React.ReactNode;
  className?: string; // Thêm prop này để nhận khoảng cách tùy chỉnh
}

export default function MenuContainer({ onClose, children, className = "mt-12" }: MenuContainerProps) {
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
        className={`absolute right-0 w-64 bg-[#282828] text-white rounded-xl shadow-2xl py-2 z-50 text-sm border border-neutral-700 overflow-hidden ${className}`}
      >
        {children}
      </div>
    </>
  );
}
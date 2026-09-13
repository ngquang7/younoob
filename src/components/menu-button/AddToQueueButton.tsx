import React from 'react';
export default function AddToQueueButton() {
  return (
    <button
      className="w-full px-4 py-2 flex items-center -mt-2 cursor-pointer hover:bg-neutral-700 transition-colors text-left rounded-t-xl"
    >
      <img alt="Add to queue" src="/public/addtoqueue.png" className="h-6 w-6 mr-3" />
      Add to queue
    </button>
  );
}
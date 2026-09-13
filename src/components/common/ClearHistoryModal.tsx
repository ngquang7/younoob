interface ClearHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ClearHistoryModal({ isOpen, onClose, onConfirm }: ClearHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#212121] flex-col text-white max-w-[80vh] max-h-[80vh] flex items-center rounded-2xl p-6 shadow-2xl relative [scrollbar-width:none]"
      >
        <div className="text-white text-xl w-full mb-5 text-left">
          Clear watch history?
        </div>
        <p className="text-gray-400 text-sm text-left flex w-full mb-5">
          Your YouTube watch history will be cleared from all YouTube apps on all devices.
        </p>
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

        <div className="flex items-center gap-3 w-full justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 mt-5 hover:bg-[#303030] text-white text-sm font-semibold rounded-full transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 mt-5 hover:bg-[#303030] text-blue-500 text-sm font-semibold rounded-full transition cursor-pointer"
            onClick={onConfirm}
          >
            Clear watch history
          </button>
        </div>
      </div>
    </div>
  );
}
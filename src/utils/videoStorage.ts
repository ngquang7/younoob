// Thêm video vào localStorage (dùng chung cho Watch Later hoặc các danh sách khác)
export const addVideoToStorage = (
  video: any,
  storageKey: string = 'saved_video',
  showNotice?: (msg: string) => void,
  noticeText?: string
) => {
  if (!video || !video.id) return;
  
  const existingList = JSON.parse(localStorage.getItem(storageKey) || '[]');
  const isAlreadyInList = existingList.some((v: any) => v.id === video.id);
  
  if (!isAlreadyInList) {
    const updatedList = [video, ...existingList];
    localStorage.setItem(storageKey, JSON.stringify(updatedList));
  }
  
  if (showNotice && noticeText) {
    showNotice(noticeText);
  }
};

// Xóa video khỏi localStorage và trả về mảng đã cập nhật để component cập nhật state
export const removeVideoFromStorage = (
  id: string,
  storageKey: string,
  currentList: any[],
  showNotice?: (msg: string) => void,
  noticeText?: string
) => {
  const updatedList = currentList.filter((v: any) => v.id !== id);
  localStorage.setItem(storageKey, JSON.stringify(updatedList));
  
  if (showNotice && noticeText) {
    showNotice(noticeText);
  }
  
  return updatedList;
};
import { useEffect } from 'react';
import { storageService } from './storageService'; 

export function useWatchHistory(video: any) {
  useEffect(() => {
    storageService.saveHistory(video);
  }, [video]);
}
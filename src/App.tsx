import './App.css'
// import YoutubeGrid from './components/YoutubeGrid'


import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage  from './pages/HomePage.tsx';
import  SearchResultsPage  from './pages/SearchResultsPage';
import WatchPage from './pages/WatchPage';
import LoginPage from './pages/LoginPage';
import HistoryPage from './pages/HistoryPage.tsx';
import ChannelPage from './pages/ChannelPage.tsx';
import SubcriptionPage from './pages/SubcriptionPage.tsx';
import LikedVideoPage from './pages/LikedVideoPage.tsx';
import YouPage from './pages/YouPage.tsx';

function App() {

  return (
<>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<SearchResultsPage />} />
      <Route path="/watch" element={<WatchPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/feed/history" element={<HistoryPage/>} />
      <Route path="/channel/:channelId" element={<ChannelPage />} />
      <Route path ="/feed/channels" element={<SubcriptionPage />} />
      <Route path ="/likedvideo" element={<LikedVideoPage />} />
      <Route path ="/feed/you" element={<YouPage />} />
    </Routes>
  </BrowserRouter>
</>
  );
}
export default App

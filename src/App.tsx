import './App.css'
import Header from './components/Header';
import YoutubeGrid from './components/YoutubeGrid'
import LeftBar from './components/LeftBar'

function App() {

  return (
    <>
    <div className="overlay">
        <Header />
        <div className="line-separate-css"></div>
        <LeftBar />
    </div>

      <div className="content-css">
        <YoutubeGrid />
      </div>
    </>
  )
}

export default App

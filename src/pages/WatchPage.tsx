import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import LeftBar from '../components/LeftBar'
import WatchComponent from '../components/WatchComponent';

export default function WatchPage() {
    const navigate = useNavigate();
    const [sidebarExpanded, setSidebarExpanded] = useState(true);

    const goHome = () => {
    navigate(`/`);
    }    
    const goHistory = () => {
        navigate(`/history`);
    }
    const goToSearchResults = (search: String) => {
    // Navigate to a new route with query parameters
    navigate(`/search?q=${search}`);
    };
    useEffect(() => {
        if (window.innerWidth < 768) {
        setSidebarExpanded(false);
        }
    }, []);

    return (
    <>
        <Header
            goHome={goHome}
            onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
            onCustomClick={goToSearchResults}
        />

        <LeftBar
            goHistory={goHistory}
            goHome={goHome}
            expanded={sidebarExpanded}
        />
        
        <main className={`pt-16 ${sidebarExpanded ? 'ml-60' : 'ml-16'} p-4`}>
            <WatchComponent />
        </main>
    </>

    );
}
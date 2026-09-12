import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/navigation/Header';
import LeftBar from '../components/navigation/LeftBar'
import WatchComponent from '../components/WatchComponent';
import WatchCom from '../components/WatchCom';
export default function WatchPage() {
    const navigate = useNavigate();
    const [sidebarExpanded, setSidebarExpanded] = useState(true);
    const goSearchResults = (search: String) => navigate(`/search?q=${search}`); // Navigate to a new route with query parameters

    useEffect(() => {
        if (window.innerWidth < 768) {
            setSidebarExpanded(false);
        }
    }, []);

    return (
        <>
            <Header
                onToggleSidebar={() => setSidebarExpanded(!sidebarExpanded)}
                onCustomClick={goSearchResults}
            />

            <LeftBar
                expanded={sidebarExpanded}
            />
            
            <main className={`pt-16 ${sidebarExpanded ? 'ml-60' : 'ml-18'} p-4`}>
                <WatchCom />
            </main>
        </>
    );
}
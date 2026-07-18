import logo from '../assets/logo-white.png'
import line from '../assets/linee.png'

export default function Header() {

    return (
        <div className="header-css">
            <button className="line-css">
                <img src={line} style={{ width: '10px', height: 'auto'}} />
            </button>

            <button className="home-css">
                <img src={logo} alt="loglo" style={{ width: '80px', height: 'auto'}} />
            </button>

            <div>
                <input
                type="text"
                placeholder="Search"
                // value={query}
                // onChange={(e) => setQuery(e.target.value)}
                className="search-bar"
                />
            </div>


        </div>

    );
}
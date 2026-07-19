import homeee from '../assets/homeee.png';
import sub from '../assets/sub4.png';
import line from '../assets/linee.png'
import React, {useState } from "react"

type LeftBarProps = {
  open: boolean;
  toggleSidebar: () => void;
};


export default function LeftBar({ open, toggleSidebar }: LeftBarProps) {
    return (
        
        <>
    <div style={{marginTop: '-68px'}}>
    <button className="line-css" onClick={toggleSidebar}>
    <img src={line} style={{ width: '18px', height: 'auto'}} />
    </button>
    </div>


        <div className={`sidebar ${open ? "open" : ""}`}>
            <button style={{display: 'flex', flexDirection:'row', marginTop: '5px', width: '150px', borderRadius: '10px', backgroundColor: 'black', cursor: 'pointer'}}>
                    <img src={homeee} style={{ width: '30px', height: 'auto', alignItems: 'center'}}/>
                    <div style={{color: 'white', fontSize: '15px', marginTop: '10px'}}>home</div>
            </button>
        </div>
      <div className={`content ${open ? "shifted" : ""}`}>
      </div>    


    {/* Home */}
    <button className="button-bar">
        <img src={homeee} style={{ width: '30px', height: 'auto', alignItems: 'center'}}/>
        <br />
        <div style={{color: 'white', fontSize: '10px'}}>home</div>
    </button>

    {/* Subscription */}
        <br />

        <button className="button-bar">
            <img src={sub} style={{ width: '30px', height: 'auto', alignItems: 'center'}}/>
            <br />
            <div style={{color: 'white', fontSize: '10px', marginLeft: '-3px'}}>subscription</div>
        </button>



    



        
        </>
    );  
}
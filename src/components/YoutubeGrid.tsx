import React, {useState } from "react"

type YoutubeGridProps = {
  open: boolean;
};
export default function YoutubeGrid({ open }: YoutubeGridProps) {

  return (
    <div className={`content ${open ? "shifted" : ""}`}>
      

      video
      
      </div>
  );
}
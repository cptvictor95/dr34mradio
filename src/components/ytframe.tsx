import React, { useEffect, useState, useContext } from "react";
import PlayerContext from "../contexts/PlayerContext";

declare global {
  interface Window {
    onYouTubePlayerAPIReady: () => any;
  }
}

export const YTiframe: React.FC = () => {
  const player = useContext(PlayerContext);

  useEffect(() => {


    // return () => {
    //  document.body.removeChild(script);
    // };
  }, []);

  return <div id="ytplayer"></div>;
};

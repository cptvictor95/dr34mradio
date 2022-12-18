import React, { useEffect, useState, useContext } from "react";
import PlayerContext from "../contexts/PlayerContext";

declare global {
  interface Window {
    onYouTubePlayerAPIReady: () => any;
  }
}

export const YTiframe: React.FC<{}> = ({}) => {
  const player = useContext(PlayerContext);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.body.appendChild(script);
    
    if (typeof window === "object") {
      // esta função precisa ter este nome e ser global para funcionar
      window.onYouTubePlayerAPIReady = () => {
        const ytframe = "ytplayer";
        player.videoPlayer.current = new window.YT.Player(ytframe, player.options);
      };
    }

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="ytplayer"></div>;
};

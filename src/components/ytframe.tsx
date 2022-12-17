import React, { useEffect, useState, useRef } from "react";

declare global {
  interface Window {
    onYouTubePlayerAPIReady: () => any;
  }
}

export const YTiframe: React.FC<{
  stateFunction: any;
  setVideoPlayer: any;
}> = ({ stateFunction, setVideoPlayer }) => {
  let player;
  const [playerReady, setPlayerReady] = useState(false);
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.body.appendChild(script);

    function onPlayerReady(event) {
      event.target.setVolume(15);
      event.target.playVideo();
      setPlayerReady(true);
    }

    function onPlayerStateChange(event) {
      stateFunction(event.data);
    }

    // REFACTOR THIS TO useRef
    if (!playerReady && typeof window === "object") {
      const playerVars: YT.PlayerVars = {
          mute: 1,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          modestbranding: 1,
          autoplay: 1,
        };

      const playerOptions: YT.PlayerOptions = {
        height: (9 * window.innerHeight) / 10,
        width: window.innerWidth,
        /* height: '360',
                         width: '640', */
        videoId: "",
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
        playerVars: playerVars,
      }
      // esta função precisa ter este nome e ser global para funcionar

      window.onYouTubePlayerAPIReady = () => {
        const ytframe = "ytplayer";
        player = new window.YT.Player(ytframe, playerOptions);
        setVideoPlayer(player);
      };
    }

    return () => {
      document.body.removeChild(script);
    };
  }, [playerReady]);

  return <div id="ytplayer"></div>;
};

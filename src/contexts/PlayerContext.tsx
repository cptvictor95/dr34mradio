import React, { createContext, useRef } from "react";
const PlayerContext = createContext<any>({});

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const videoPlayer = React.useRef<YT.Player | null>(null);
    const playerState = useRef<YT.PlayerState | null>(null);

    const playerVars: YT.PlayerVars = {
        mute: 1,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        modestbranding: 1,
        autoplay: 1,
    };

    const playerOptions: YT.PlayerOptions = {
        // height: (9 * window.innerHeight) / 10,
        // width: window.innerWidth,
        height: '360',
        width: '640',
        videoId: "",
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        },
        playerVars: playerVars,
    }

    function onPlayerReady(event) {
        event.target.setVolume(15);
        event.target.playVideo();
    }

    function onPlayerStateChange(event) {
        playerState.current = event.data;
    }


    // play video using yt iframe ref
    const playVideo = (videoID: string) => {
        if (videoPlayer.current) {
            videoPlayer.current.loadVideoById(videoID);
        }
    };
    // toggle mute/unmute video using yt iframe ref
    const toggleMute = () => {
        if (videoPlayer.current) {
            videoPlayer.current.isMuted() ? videoPlayer.current.unMute() : videoPlayer.current.mute();
        }
    };

    // change volume based on input value
    const changeVolume = (volume: number) => {
        if (videoPlayer.current) {
            if (videoPlayer.current.isMuted()) {
                videoPlayer.current.unMute();
            }
            videoPlayer.current.setVolume(volume);
        }
    };

    return (
        <PlayerContext.Provider value={{
            videoPlayer: videoPlayer,
            playVideo: playVideo,
            toggleMute: toggleMute,
            changeVolume: changeVolume,
            playerOptions: playerOptions,
            playerState: playerState
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export default PlayerContext;
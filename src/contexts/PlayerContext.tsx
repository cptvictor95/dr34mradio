import React, { createContext, useRef } from "react";
import { trpc } from "../utils/trpc";
const PlayerContext = createContext<any>({});

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: videos, refetch } = trpc.videos.getAll.useQuery();
    const videoPlayer = useRef<YT.Player | null>(null);
    const playerState = useRef<YT.PlayerState | null>(null);
    const mute = useRef<boolean>(true);
    const volume = useRef<number>(15);

    const playerVars: YT.PlayerVars = {
        mute: 1,
        controls: 0,
        disablekb: 1,
        enablejsapi: 1,
        modestbranding: 1,
        autoplay: 1,
    };

    // these dimensions will be used later to set the player size
    // and change things if we are on mobile
    const width = () => {
        if (typeof window != "object") {
            return "640";
        } else {
            return window.innerWidth;
        }
    };

    const height = () => {
        if (typeof window != "object") {
            return "360";
        } else {
            return (9 * window.innerHeight) / 10;
        }
    };

    // gets the id of the head of videos queue
    function headVideoID() {
        if (videos && videos.length > 0) {
            return videos[0].ytID;
        } else {
            return "M7lc1UVf-VE";
        }
    }

    const playerOptions: YT.PlayerOptions = {
        height: height(),
        width: width(),
        videoId: headVideoID(),
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        },
        playerVars: playerVars,
    }

    function onPlayerReady(event) {
        event.target.setVolume(volume.current);
        event.target.playVideo();
    }

    function onPlayerStateChange(event) {
        playerState.current = event.data;
        console.log("state", playerState.current);
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
        mute.current = !mute.current;
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
            isMuted: mute,
            changeVolume: changeVolume,
            options: playerOptions,
            state: playerState,
            videos: videos,
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export default PlayerContext;
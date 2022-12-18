import React, { createContext, useRef } from "react";
import { trpc } from "../utils/trpc";
const PlayerContext = createContext<any>({});

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { data: videos, refetch } = trpc.videos.getAll.useQuery();
    const sendPlayVideo = trpc.videos.playVideo.useMutation();
    const deleteVideo = trpc.videos.deleteVideo.useMutation();
    const videoPlayer = useRef<YT.Player | null>(null);
    const playerState = useRef<YT.PlayerState | null>(null);
    const playerInSync = useRef<boolean>(false);
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

    // function that returns the current playing video length using the youtube js api
    function currentVideoLength() {
        if (videoPlayer.current) {
            return videoPlayer.current.getDuration();
        } else {
            return 0;
        }
    }

    function currentVideoTime() {
        if (videoPlayer.current) {
            return videoPlayer.current.getCurrentTime();
        } else {
            return 0;
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
        /* started playing */
        if (playerState.current === window.YT.PlayerState.PLAYING) {
            /* checks if the video has started */
            if (videos[0]?.started && !playerInSync.current) {
                /* jumps to current position */
                /* gets startedPlayingAt */
                /* and compares it with now */
                let videoTime = Date.now() - Number(videos[0]?.startedPlayingAt);
                videoTime = videoTime / 1000;
                /* send it to player */
                videoPlayer.current.seekTo(videoTime, true);
                playerInSync.current = true;
            } else if (videos[0].started === false) {
                /* video hasn't started */
                /* sends starting time to api */
                /* changes video state to started */
                sendPlayVideo.mutate({
                    id: videos[0].id,
                    startedPlayingAt: Date.now(),
                });
            }
        }

        /* video player finished playing */
        if (playerState.current === window.YT.PlayerState.ENDED &&
            videos[1]) {
            /* play next video */
            videoPlayer.current.loadVideoById(videos[1].ytID);
            /* delete previous video */
            deleteVideo.mutate({
                id: videos[0].id,
            });
            /* TODO checks if it was successful */
            /* TODO resets queue index */
            refetch();
        } else if (playerState.current === window.YT.PlayerState.ENDED &&
            videos[0]) {
            deleteVideo.mutate({
                id: videos[0].id,
            });
            refetch();
        }
        if (playerState.current === window.YT.PlayerState.UNSTARTED) {
            videoPlayer.current.loadVideoById(videos[0].ytID);
            console.log("videos", videos);
        }
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
            getVolume: videoPlayer.current ? videoPlayer.current.getVolume() : 0,
            options: playerOptions,
            state: playerState,
            videos: videos,
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export default PlayerContext;
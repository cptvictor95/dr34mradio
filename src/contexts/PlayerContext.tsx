import React, { createContext, useRef, useState, useContext, useEffect } from "react";
import PlaylistContext from "./PlaylistContext";
import { trpc } from "../utils/trpc";
// TODO refactor this with the correct types
const PlayerContext = createContext<any>({});

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const playlist = useContext(PlaylistContext);
    const sendPlayVideo = trpc.videos.playVideo.useMutation();
    const deleteVideo = trpc.videos.deleteVideo.useMutation();
    const playerState = useRef<YT.PlayerState | null>(null);
    const playerInSync = useRef<boolean>(false);
    const mute = useRef<boolean>(true);
    const volume = useRef<number>(15);
    const firstVideoID= "Ks-_Mh1QhMc";
    const videoPlayer = useRef<YT.Player | null>(null);
    const [isReady, setIsReady] = useState<boolean>(false);
    
    useEffect(() => {
        if (!isReady) {
            const script = document.createElement("script");
            script.src = "https://www.youtube.com/iframe_api";
            script.async = true;
            document.body.appendChild(script);
        
            if (typeof window === "object") {
            // esta função precisa ter este nome e ser global para funcionar
                window.onYouTubePlayerAPIReady = () => {
                    const ytframe = "ytplayer";
                    videoPlayer.current = new window.YT.Player(ytframe, playerOptions);
                };
            }
        } else {
            /* gets current playing video */
            let currentPlaying = videoPlayer.current?.getVideoUrl()
            /* gets video id */
            currentPlaying = currentPlaying?.split("v=")[1] as string;
            console.log("playing", currentPlaying);
            // compares with the default video id
            if (currentPlaying === firstVideoID && playlist.videos.length > 0) {
                /* if it's the default video */
                /* play the first video in the playlist */
                playVideo(playlist.videos[0].ytID);
                playlist.setIsPlaying(true);
            }
        }
    }, [isReady]);

    useEffect(() => {
        if (playlist 
            && playlist.videos 
            && playlist.videos.length > 0 
            && playerState.current === 0) {
            playVideo(playlist.videos[1].ytID);
        }
        if (playerState.current === -1 && playlist.videos.length > 0) {
            /* if it's the default video */
            /* play the first video in the playlist */
            playVideo(playlist.videos[0].ytID);
            playlist.setIsPlaying(true);
        }
    }, [playerState.current]);

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
        if (playlist.videos && playlist.videos[0]) {
            return playlist.videos[0].ytID;
        } else {
            return firstVideoID;
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

    function onPlayerReady(event: YT.PlayerEvent) {
        event.target.setVolume(volume.current);
        event.target.playVideo();
        setIsReady(true);
    }

    function onPlayerStateChange(event: YT.OnStateChangeEvent) {
        playerState.current = event.data;
        console.log("playerState: ", playerState.current);
    }

    // play video using yt iframe ref
    // TODO sync video with api data
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
    const changeVolume = (input: number) => {
        if (videoPlayer.current) {
            if (videoPlayer.current.isMuted()) {
                videoPlayer.current.unMute();
            }
            videoPlayer.current.setVolume(input);
            volume.current = input;
        }
    };

    const isPlaying = () => {
        console.log("isPlaying: ", playerState.current)
        return playerState.current === 1
            || playerState.current === 3;
    }

    return (
        <PlayerContext.Provider value={{
            videoPlayer: videoPlayer,
            playVideo: playVideo,
            toggleMute: toggleMute,
            isMuted: mute,
            changeVolume: changeVolume,
            getVolume: volume.current,
            options: playerOptions,
            state: playerState,
            isPlayerReady: isReady,
            isPlaying: isPlaying,
        }}>
            {children}
        </PlayerContext.Provider>
    );
};

export default PlayerContext;

// useEffect(() => {
//     if (typeof window != "object"
//     && !isReady)
//         return;
    
//     if (playerState.current === -1 
//         && playlist.videos 
//         && playlist.videos[0]
//         && !playlist.isPlaying) {
//         console.log("video player", videoPlayer.current);
//         console.log(playlist.videos[0].ytID)
//         videoPlayer.current?.loadVideoById(playlist.videos[0].ytID);
//         playlist.setIsPlaying(true);
//     }

//     if (playerState.current === 0) {
//         if (playlist.videos && playlist.videos[0]) {
//             deleteVideo.mutateAsync(playlist.videos[0].id);    
//         }
//         if (playlist.videos[1]) {
//             playVideo(playlist.videos[1].ytID);
//             sendPlayVideo.mutateAsync(playlist.videos[1].id);
//         }
//     }
//     /* video player finished playing */
//     if (playerState.current === 0 &&
//         playlist.videos[1]) {
//         /* play next video */
//         playVideo(playlist.videos[1].ytID);
//         /* delete previous video */
//         deleteVideo.mutate({
//             id: playlist.videos[0].id,
//         });
//         /* TODO checks if it was successful */
//         /* TODO resets queue index */
//     } else if (playerState.current === 0 &&
//         playlist.videos[0]) {
//         console.log("parou")
//         deleteVideo.mutate({
//             id: playlist.videos[0].id,
//         });
//     }

    

//     if (videoPlayer.current === null) {
//         console.error("no videoPlayer");
//         return;
//     }

//     if (playerState.current === -1) {
//         playVideo(playlist.videos[0]?.ytID as string);
//         videoPlayer.current.playVideo();
//     }

//     /* started playing */
//     if (playerState.current === 1) {
//         /* gets current playing video */
//         let currentPlaying = videoPlayer.current.getVideoUrl()
//         /* gets video id */
//         currentPlaying = currentPlaying.split("v=")[1] as string;
//         console.log("playing", currentPlaying);
//         // compares with the default video id
//         if (currentPlaying === "M7lc1UVf-VE") {
//             /* if it's the default video */
//             /* play the first video in the playlist */
//             playVideo(playlist.videos[0].ytID);
//         }
//         /* checks if the video has started */

//         if (playlist.videos[0].started && !playerInSync.current) {
//             /* jumps to current position */
//             /* gets startedPlayingAt */
//             /* and compares it with now */
//             let videoTime = Date.now() - Number(playlist.videos[0]?.startedPlayingAt);
//             videoTime = videoTime / 1000;
//             /* send it to player */
//             videoPlayer.current.seekTo(videoTime, true);
//             playerInSync.current = true;
//         } else if (playlist.videos[0].started === false) {
//             /* video hasn't started */
//             /* sends starting time to api */
//             /* changes video state to started */
//             sendPlayVideo.mutate({
//                 id: playlist.videos[0].id,
//                 startedPlayingAt: Date.now(),
//             });
//         }
//     }

//     if (!playlist.playlist) {
//         console.log("no videos");
//         return;
//     }
// }, [isReady, playerState.current, playlist.isLoading, playlist.videos]);
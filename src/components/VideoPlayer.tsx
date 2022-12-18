import { YTiframe } from "./ytframe";
import { trpc } from "../utils/trpc";
import { useState, useEffect, useContext } from "react";
import type { BaseSyntheticEvent } from "react";
import { ToggleSound } from "./ToggleSound";
import PlayerContext from "../contexts/PlayerContext";
import { VolumeBar } from "./VolumeBar";

export const VideoPlayer: React.FC = () => {
  const player = useContext(PlayerContext);
  // trpc video playlist queue
  const { data: videos, isLoading, refetch } = trpc.videos.getAll.useQuery();
  const playVideo = trpc.videos.playVideo.useMutation();
  const deleteVideo = trpc.videos.deleteVideo.useMutation();

  // video player states
  const [playerInSync, setPlayerInSync] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    console.log("estado", player.state.current)
    if (videos
      && videos.length > 0
      && typeof window === "object") {

      /* started playing */
      if (player.state.current === window.YT.PlayerState.PLAYING) {
        /* checks if the video has started */
        if (videos[0]?.started && !playerInSync) {
          /* jumps to current position */
          /* gets startedPlayingAt */
          /* and compares it with now */
          let videoTime = Date.now() - Number(videos[0]?.startedPlayingAt);
          videoTime = videoTime / 1000;
          /* send it to player */
          player.videoPlayer.current.seekTo(videoTime, true);
          setPlayerInSync(true);
        } else if (videos[0].started === false) {
          /* video hasn't started */
          /* sends starting time to api */
          /* changes video state to started */
          playVideo.mutate({
            id: videos[0].id,
            startedPlayingAt: Date.now(),
          });
        }
      }

      /* video player finished playing */
      if (player.state.current === window.YT.PlayerState.ENDED &&
        videos[1]) {
        /* play next video */
        player.playVideo(videos[1].ytID);
        /* delete previous video */
        deleteVideo.mutate({
          id: videos[0].id,
        });
        /* TODO checks if it was successful */
        /* TODO resets queue index */
        refetch();
      } else if (player.state.current === window.YT.PlayerState.ENDED &&
        videos[0]) {
        deleteVideo.mutate({
          id: videos[0].id,
        });
        refetch();
      }
      if (player.state.current === window.YT.PlayerState.UNSTARTED) {
        player.playVideo(videos[0].ytID);
        console.log("videos", videos);
      }
    }
  }, [player.state.current]);

  return (
    <div className="flex grow flex-row items-center justify-items-center">
      <div className="video indicator">
        <div className="absolute flex h-full w-full">
          <div>
            ladoesquerdo
            <VolumeBar />
          </div>
          <ToggleSound />
          <div>lado direito</div>
        </div>
        {!isLoading ?
          <YTiframe />
          :
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl">No videos in queue</h1>
            <h2 className="text-xl">Add some videos to the queue</h2>
            </div>}
        
      </div>
    </div>
  );
};



import { YTiframe } from "./ytframe";
import { trpc } from "../utils/trpc";
import { useEffect, useContext } from "react";
import type { BaseSyntheticEvent } from "react";
import { ToggleSound } from "./ToggleSound";
import PlayerContext from "../contexts/PlayerContext";
import { VolumeBar } from "./VolumeBar";

export const VideoPlayer: React.FC<{isPlaying: boolean}> = ({isPlaying}) => {
  const player = useContext(PlayerContext);
  // trpc video playlist queue
  const { data: videos, isLoading, refetch } = trpc.videos.getAll.useQuery();
  console.log("video player");
  useEffect(() => {
    console.log("estado", player.state.current)
    if (videos
      && videos.length > 0
      && typeof window === "object") {

      }   
  }, [JSON.stringify(videos), isLoading]);

  return (
    <div className="flex indicator grow flex-row items-center justify-items-center">
      {!player.isPlaying ? <div className="absolute bg-gray-500 h-full w-full text-white z-10">loading</div> : null}
      <div className="video indicator">
        <div className="absolute flex h-full w-full">
          <div>
            ladoesquerdo
            <VolumeBar />
          </div>
          <ToggleSound />
          <div>lado direito</div>
        </div>
          <YTiframe />
      </div>
      
    </div>
  );
};



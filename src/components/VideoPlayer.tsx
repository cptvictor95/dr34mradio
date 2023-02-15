import { YTiframe } from "./ytframe";
import { trpc } from "../utils/trpc";
import { useEffect, useContext } from "react";
import type { BaseSyntheticEvent } from "react";
import { ToggleSound } from "./ToggleSound";
import PlayerContext from "../contexts/PlayerContext";
import PlaylistContext from "../contexts/PlaylistContext";
import { VolumeBar } from "./VolumeBar";

export const VideoPlayer: React.FC = () => {
  const player = useContext(PlayerContext);
  const playlist = useContext(PlaylistContext);
  // trpc video playlist queue
  
  // TODO change the loading screen condition
  return (
    <div className="flex indicator grow flex-row items-center justify-items-center">
      {!playlist.isPlaying && false ? <div className="absolute bg-gray-500 h-full w-full text-white z-10">loading</div> : null}
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



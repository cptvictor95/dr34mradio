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
        {!isLoading && videos.length > 0 ?
          <YTiframe />
          :
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl">Sem vídeos na fila</h1>
            <h2 className="text-xl">Adicione um vídeo na caixa de busca</h2>
            </div>}
        
      </div>
    </div>
  );
};



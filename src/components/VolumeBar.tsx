import { useContext, BaseSyntheticEvent } from "react";
import PlayerContext from "../contexts/PlayerContext";

export const VolumeBar = () => {
    const player = useContext(PlayerContext);
    function handleVolume(e: BaseSyntheticEvent) {
      if (player.videoPlayer != null) {
        player.changeVolume(e.target.value);
      }
    }
  
    return (
      <div>
        <input
          onChange={(e) => handleVolume(e)}
          type="range"
          min="0"
          max="100"
          className="range"
        />
      </div>
    )
  }
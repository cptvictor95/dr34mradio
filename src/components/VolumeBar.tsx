import { useState, useContext, BaseSyntheticEvent, useEffect } from "react";
import PlayerContext from "../contexts/PlayerContext";

export const VolumeBar = () => {
    const player = useContext(PlayerContext);
    const [slider, setSlider] = useState(player.getVolume);

    function handleVolume(e: BaseSyntheticEvent) {
      if (player.videoPlayer != null) {
        player.changeVolume(e.target.value);
        setSlider(e.target.value);
      }
    }
    
    return (
      <div>
        <input
          onChange={(e) => handleVolume(e)}
          type="range"
          min="0"
          max="100"
          value={slider}
          className="range"
        />
      </div>
    )
  }
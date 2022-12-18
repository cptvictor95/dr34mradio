import { useState, useContext, BaseSyntheticEvent, useEffect } from "react";
import PlayerContext from "../contexts/PlayerContext";

export const VolumeBar = () => {
    const player = useContext(PlayerContext);
    const [volume, setVolume] = useState(0);

    function handleVolume(e: BaseSyntheticEvent) {
      if (player.videoPlayer != null) {
        player.changeVolume(e.target.value);
        setVolume(e.target.value);
      }
    }

    // make an useEffect to get the current volume
    // and set it to the input value
    useEffect(() => {
        if (player.videoPlayer.current) {
            setVolume(player.videoPlayer.getVolume);
        }
    }, []);
  
    return (
      <div>
        <input
          onChange={(e) => handleVolume(e)}
          type="range"
          min="0"
          max="100"
          value={volume}
          className="range"
        />
      </div>
    )
  }
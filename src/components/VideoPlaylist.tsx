import type { Video } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Playlist } from "phosphor-react";
import { trpc } from "../utils/trpc";
import { VideoPlaylistItem } from "./VideoPlaylistItem";
import PlaylistContext from "../contexts/PlaylistContext";
import { useContext } from "react";

export const VideoPlaylist: React.FC = ({}) => {
  const playlist = useContext(PlaylistContext);
  // const { data: videos } = trpc.videos.getAll.useQuery();
  let videos = playlist.videos;
  // const videos = playlist.playlist;
  const client = playlist.client;

  return (
    <section className="dropdown-bottom dropdown-end dropdown">
      <button tabIndex={0} className="btn m-1 flex gap-2">
        <Playlist size={20} weight="bold" />
        Queue
      </button>
      <ul
        id="videoPlaylist"
        tabIndex={0}
        className="dropdown-content menu flex min-w-max gap-2 rounded-lg bg-gray-800 p-4"
      >
        {videos && videos.length > 0
          ? videos?.map((vid: Video) => {
            if(vid !== undefined) {
              return (
                <VideoPlaylistItem key={vid.ytID} video={vid} client={client} />
              );
            } else {
              return null;
            }
            })
          : "The queue is empty"}
      </ul>
    </section>
  );
};

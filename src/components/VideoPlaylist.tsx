import type { Video } from "@prisma/client";
import { trpc } from "../utils/trpc";
import { VideoPlaylistItem } from "./VideoPlaylistItem";

export const VideoPlaylist: React.FC = ({}) => {
  const { data: videos } = trpc.videos.getAll.useQuery();
  const deleteVideo = trpc.videos.deleteVideo.useMutation();

  return (
    <div className="dropdown-bottom dropdown-end dropdown">
      <label tabIndex={0} className="btn m-1">
        Playlist
      </label>
      <ul
        id="videoPlaylist"
        tabIndex={0}
        className="dropdown-content menu w-1/4 bg-black/70"
      >
        {videos?.map((vid: Video) => {
          return (
            <VideoPlaylistItem
              key={vid.ytID}
              video={vid}
              deleteVideo={deleteVideo}
            />
          );
        })}
      </ul>
    </div>
  );
};

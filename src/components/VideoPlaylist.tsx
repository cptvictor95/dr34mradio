import { Video } from "@prisma/client";
import { trpc } from "../utils/trpc";
import { VideoPlaylistItem } from "./VideoPlaylistItem";

export const VideoPlaylist: React.FC<{}> = ({}) => {
	  const { data: videos, isLoading, refetch } = trpc.videos.getAll.useQuery();
  const deleteVideo = trpc.videos.deleteVideo.useMutation();
 
	return (
		<div className="dropdown dropdown-bottom dropdown-end">
			<label tabIndex={0} className="btn m-1">Playlist</label> 
		<ul
			id="videoPlaylist"
			tabIndex={0}
			className="dropdown-content menu bg-black/70 w-1/4">
			{videos?.map((vid: Video, index: number) => {
				return <VideoPlaylistItem
					key={vid.ytID}
					video={vid}
					deleteVideo={deleteVideo} />
			})}
		</ul>
		</div>
	);
}
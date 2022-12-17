export const VideoPlaylistItem: React.FC<{video: any, deleteVideo: any}> = ({ video, deleteVideo }) => {
	function handleDeleteVideo () {
		deleteVideo.mutate({
			id: video.id,
		})
	}
	
	return (
		<li
			className="bg-black/70 hover:bg-white hover:text-black
			hover:transition hover:duration-200 hover:ease-in-out"
			key={video.id}>
			<button
				className="btn-primary btn-sm btn-circle"
				onClick={handleDeleteVideo}>
				delete
			</button>
			<a className="px-3"
				href={video.link}>{video.name}</a>
		</li>
	);
};
import type { Video } from "@prisma/client";
import type { QueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { Trash } from "phosphor-react";
import { trpc } from "../utils/trpc";

const updateCache = ({
  client,
  data,
}: {
  client: QueryClient;
  data: Video;
}) => {
  client.setQueryData(
    [
      ["videos", "getAll"],
      {
        type: "query",
      },
    ],
    (oldData) => {
      const newData = oldData as Video[];

      return newData.filter((video) => video.id !== data.id);
    }
  );
};

export const VideoPlaylistItem: React.FC<{
  video: Video;
  client: QueryClient;
}> = ({ video, client }) => {
  const { mutateAsync } = trpc.videos.deleteVideo.useMutation({
    onSuccess: (data) => {
      updateCache({ client, data });
    },
  });
  const router = useRouter();

  const onDeleteVideo = (id: string) => {
    mutateAsync({
      id,
    });
  };

  return (
    <li
      className="btn-group-horizontal btn-group min-w-max text-white"
      key={video.id}
    >
      <button className="btn px-5 py-1" onClick={() => router.push(video.link)}>
        {video.name}
      </button>
      <button
        className="btn btn-error py-1"
        onClick={() => onDeleteVideo(video.id)}
      >
        <Trash size={20} weight="bold" />
      </button>
    </li>
  );
};

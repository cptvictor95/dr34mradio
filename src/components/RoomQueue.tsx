import type { Video } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { Playlist } from "phosphor-react";
import { trpc } from "../utils/trpc";
import { RoomQueueItem } from "./RoomQueueItem";

export const RoomQueue: React.FC = ({}) => {
  const { data: videos } = trpc.videos.getAll.useQuery();
  const client = useQueryClient();

  return (
    <section className="dropdown-bottom dropdown-end dropdown">
      <button tabIndex={0} className="btn m-1 flex gap-2">
        <Playlist size={20} weight="bold" />
        Queue
      </button>
      <ul
        id="roomQueue"
        tabIndex={0}
        className="dropdown-content menu flex min-w-max gap-2 rounded-lg bg-gray-800 p-4"
      >
        {videos?.length > 0
          ? videos?.map((vid: Video) => {
              return (
                <RoomQueueItem key={vid.ytID} video={vid} client={client} />
              );
            })
          : "The queue is empty"}
      </ul>
    </section>
  );
};

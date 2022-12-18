import { createContext, useState } from "react";
import type { Video } from "@prisma/client";
import { QueryClient, useQueryClient } from "@tanstack/react-query"
import { trpc } from "../utils/trpc";
import React from "react";

const PlaylistContext = createContext({});

const updateCache = ({ client, data, }: {
    client: QueryClient;
    data: Video;
}) => {
    client.setQueryData(
        [["videos", "getAll"], { type: "query", },],
        (oldData) => {
            const newData = oldData as Video[];
            newData.push(data);
            return newData;
        }
    );
};

// provider
export const PlaylistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const client = useQueryClient();
    const { data: videos } = trpc.videos.getAll.useQuery();
    const [playlist, setPlaylist] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const { mutateAsync } = trpc.videos.playVideo.useMutation({
        onSuccess: (data) => {
            updateCache({ client, data });
        },
    });

    const values = React.useMemo(() => ({ playlist, setPlaylist, isPlaying, setIsPlaying }),
        [playlist, setPlaylist, isPlaying, setIsPlaying]);
    return (
        <PlaylistContext.Provider value={values}>
            {children}
        </PlaylistContext.Provider>
    );
}


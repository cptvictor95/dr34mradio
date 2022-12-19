import { createContext, useEffect, useState } from "react";
import type { Video } from "@prisma/client";
import { QueryClient, useQueryClient } from "@tanstack/react-query"
import { trpc } from "../utils/trpc";
import React, { useContext } from "react";
import PlayerContext from "./PlayerContext";

export const PlaylistContext = createContext<any>({});

const updateCacheAdd = ({ client, data, }: {
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
    const player = useContext(PlayerContext);
    const client = useQueryClient();
    const { data: videos, isLoading } = trpc.videos.getAll.useQuery();
    const [playlist, setPlaylist] = useState<Video[]>(videos as Video[]);
    const [isPlaying, setIsPlaying] = useState(false);
    const { mutateAsync: mutateAsyncAdd,  } = trpc.videos.postVideo.useMutation({
        onSuccess: (data) => updateCacheAdd({ client, data }),
    });

    useEffect(() => {
        console.log("playlist provider", videos);
        setPlaylist(videos as Video[]);
    }, [videos]);

    const onAddVideo = ({link, name, ytID}) => {
        mutateAsyncAdd({
            link,
            name,
            ytID,
        });
    };

    // const values = React.useMemo(() => ({ onAddVideo, playlist, setPlaylist, isPlaying, setIsPlaying }),
     //  [playlist, isPlaying, isLoading]);
    return (
        <PlaylistContext.Provider value={{
            onAddVideo: onAddVideo, 
        client: client,
        playlist: playlist,
        videos: videos,
        isLoading: isLoading,
        isPlaying: isPlaying,
        setIsPlaying: setIsPlaying,
        
        }}>
            {children}
        </PlaylistContext.Provider>
    );
}

export default PlaylistContext;
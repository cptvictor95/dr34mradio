import React, { useState, useRef, useEffect, useMemo } from "react";
import { getIDFromURL } from "../lib/getIDFromYTURL";
import type { YTQueryType } from "../types/YTQueryType";
import type { ResultItem, YTResult } from "../types/YTResult";
import { trpc } from "../utils/trpc";
import { QueryTypeSelector } from "./QueryTypeSelector";
import { SearchBarButton } from "./SearchBarButton";
import { debounce } from "lodash";
import { Video } from "@prisma/client";
import { QueryClient, useQueryClient } from "@tanstack/react-query";

export const SearchBar: React.FC = () => {
  const [keywordString, setKeywordString] = useState("");
  const { data: ytQueryResponseData } = trpc.yt.queryYTVideos.useQuery({
    query: keywordString,
  });

  return (
    <InputBox
      ytQueryResponseData={ytQueryResponseData}
      setKeywordString={setKeywordString}
    />
  );
};

const updateCache = ({
  client,
  data,
}: {
  client: QueryClient;
  data: Video;
}) => {
  client.setQueryData(
    [["yt", "queryYTVideos"], { input: { query: data.name }, type: "query" }],
    (oldData) => {
      const newData = oldData as Video[];

      console.log("NEW DATA", newData);

      return [...newData, data];
    }
  );
};

const InputBox: React.FC<{
  ytQueryResponseData: YTResult;
  setKeywordString: React.Dispatch<React.SetStateAction<string>>;
}> = ({ ytQueryResponseData, setKeywordString }) => {
  const client = useQueryClient();
  const postVideo = trpc.videos.postVideo.useMutation({
    onSuccess: (data) => {
      console.log("ON SUCCESS DATA", data);
      updateCache({ client, data });
    },
  });
  const ytQueryType = useRef<YTQueryType>("TEXT");
  const [query, setQuery] = useState("");
  const [isResultListOpen, setIsResultListOpen] = useState(false);

  const handleInputChange = (key: string) => setQuery(key);

  const handleSubmit = useMemo(
    () =>
      debounce((e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        switch (ytQueryType.current) {
          case "TEXT":
            setKeywordString(query);
            break;
          case "LINK":
            const ytVideoID = getIDFromURL(query);
            /* fetch name, duration yt api */
            postVideo.mutate({
              name: "to be filled",
              link: query,
              ytID: ytVideoID,
            });
            break;
          default:
            break;
        }
      }, 500),
    [query, setKeywordString, postVideo]
  );

  useEffect(() => {
    if (query.length == 0 && ytQueryType.current === "TEXT") {
      setIsResultListOpen(false);
    } else {
      setIsResultListOpen(true);
    }
  }, [ytQueryType, query]);

  return (
    <div className="flex gap-2">
      <QueryTypeSelector ytQueryTypeRef={ytQueryType} />
      <div className="input-group">
        <input
          type="text"
          placeholder="Busca…"
          onChange={(e) => handleInputChange(e.target.value)}
          value={query}
          className="input-bordered input text-white"
        />

        <SearchBarButton handleSubmit={handleSubmit} />
        {isResultListOpen ? (
          <CompletionResults
            ytResult={ytQueryResponseData}
            postVideo={postVideo}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

const CompletionItem: React.FC<{
  result: ResultItem;
  postVideo: any;
}> = ({ result, postVideo }) => {
  const handleClick = () => {
    postVideo.mutate({
      name: result.snippet.title,
      link: "https://www.youtube.com/watch?v=" + result.id.videoId,
      ytID: result.id.videoId,
    });
  };

  const formatTitleString = (text: string) => {
    if (text.length > 43) {
      return text.substring(0, 38) + "…";
    } else {
      return text;
    }
  };

  return (
    <div
      onClick={handleClick}
      className="w-100 flex
flex-row border-y-0 bg-white
text-base tracking-tight text-black hover:bg-lime-700"
    >
      {formatTitleString(result.snippet.title)}
    </div>
  );
};

const CompletionResults: React.FC<{
  ytResult: YTResult;
  postVideo: any;
}> = ({ ytResult, postVideo }) => {
  if (ytResult === undefined || !ytResult.items) return null;

  return (
    <div className="absolute top-16 z-50 flex flex-col">
      {ytResult.items.map((result) => {
        return (
          <CompletionItem
            key={result.id.videoId}
            postVideo={postVideo}
            result={result}
          />
        );
      })}
    </div>
  );
};

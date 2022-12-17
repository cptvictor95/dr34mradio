import React, { useState } from "react";
import { trpc } from "../utils/trpc";

export type QueriesTypesYT = "TEXT" | "LINK";

function getIDFromYTURL(url: string) {
  const regExp =
    /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2] && match[2].length == 11) {
    return match[2];
  } else {
    //error
    console.log("url inválida");
    return "";
  }
}

export type YTResult = {
  etag: string;
  id: {
    kind: string;
    videoId: string;
  };
  kind: string;
  snippet: {
    channelId: string;
    channelTitle: string;
    description: string;
    liveBroadcastContent: string;
    publishTime: string;
    publishedAt: string;
    thumbnails: string;
    title: string;
  };
};

export function YTQueryBox() {
  const [keywordString, setKeywordString] = useState("");
  const { data: ytQueryResponseData } = trpc.yt.queryYTVideos.useQuery({
    query: keywordString,
  });

  return (
    <div className="text-white">
      <InputBox
        ytQueryResponseData={ytQueryResponseData}
        setKeywordString={setKeywordString}
      />
    </div>
  );
}

export default YTQueryBox;

const InputBox = ({ ytQueryResponseData, setKeywordString }) => {
  const postVideo = trpc.videos.postVideo.useMutation();
  const [query, setQuery] = useState("");
  const [ytQueryType, setYTQueryType] = useState<QueriesTypesYT>("TEXT");

  const handleChange = (key: string) => {
    setQuery(key);
    /* setYTResults(ytQueryResponseData); */
    /* TODO chamar a fun*/
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    switch (ytQueryType) {
      case "TEXT":
        setKeywordString(query);
        break;
      case "LINK":
        const ytVideoID = getIDFromYTURL(query);
        /* fetch name, duration yt api */
        postVideo.mutate({
          name: "asd",
          link: query,
          ytID: ytVideoID,
        });
        break;
      default:
        break;
    }

    setQuery("");
  };

  function handleSelectQuery(e: React.ChangeEvent<HTMLSelectElement>) {
    if (e.target.value === "Texto" && ytQueryType === "LINK") {
      setYTQueryType("TEXT");
      setQuery("");
    } else {
      setYTQueryType("LINK");
      setQuery("");
    }
  }

  return (
    <div className="form-control">
      <div className="input-group flex-col">
        <div className="flex gap-2">
          <select
            onChange={(e) => handleSelectQuery(e)}
            className="select-bordered select text-white"
          >
            <option disabled>Tipo de busca</option>
            <option defaultValue="true">Texto</option>
            <option>Link</option>
          </select>
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Busca…"
              onChange={(e) => handleChange(e.target.value)}
              value={query}
              className="input-bordered input text-white"
            />

            {ytQueryType === "TEXT" ? (
              <CompletionResults
                ytResults={ytQueryResponseData}
                query={query}
                setQuery={setQuery}
                postVideo={postVideo}
              />
            ) : null}
          </div>
          <ButtonQueryBox handleSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

const ButtonQueryBox = ({ handleSubmit }) => {
  return (
    <button onClick={(e) => handleSubmit(e)} className="btn-square btn">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
    </button>
  );
};

const CompletionItem = ({ result, setQuery, postVideo }) => {
  const handleClick = () => {
    postVideo.mutate({
      name: result.snippet.title,
      link: "https://www.youtube.com/watch?v=" + result.id.videoId,
      ytID: result.id.videoId,
    });
    setQuery("");
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

const CompletionResults = ({ query, setQuery, ytResults, postVideo }) => {
  if (ytResults === undefined || query == "") return null;

  return (
    <div className="absolute top-16 z-50 flex flex-col">
      {ytResults.items.map((result) => {
        return (
          <CompletionItem
            key={result.id.videoId}
            postVideo={postVideo}
            result={result}
            setQuery={setQuery}
          />
        );
      })}
      ;
    </div>
  );
};

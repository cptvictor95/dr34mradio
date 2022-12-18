import React, { useState } from "react";
import { getIDFromYTURL } from "../lib/getIDFromYTURL";
import type { YTQueryType } from "../types/YTQueryType";
import type { ResultItem, YTResult } from "../types/YTResult";
import { trpc } from "../utils/trpc";

const YTQueryBox: React.FC = () => {
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

export default YTQueryBox;

const InputBox: React.FC<{
  ytQueryResponseData: YTResult;
  setKeywordString: React.Dispatch<React.SetStateAction<string>>;
}> = ({ ytQueryResponseData, setKeywordString }) => {
  const postVideo = trpc.videos.postVideo.useMutation();
  const [query, setQuery] = useState("");
  const [ytQueryType, setYTQueryType] = useState<YTQueryType>("TEXT");

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

  const handleSelectQuery = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "Texto" && ytQueryType === "LINK") {
      setYTQueryType("TEXT");
      setQuery("");
    } else {
      setYTQueryType("LINK");
      setQuery("");
    }
  };

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

const ButtonQueryBox: React.FC<{
  handleSubmit: (e: React.MouseEvent<HTMLButtonElement>) => void;
}> = ({ handleSubmit }) => {
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

const CompletionItem: React.FC<{
  result: ResultItem;
  setQuery: (value: React.SetStateAction<string>) => void;
  postVideo: any;
}> = ({ result, setQuery, postVideo }) => {
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

const CompletionResults: React.FC<{
  query: string;
  setQuery: (value: React.SetStateAction<string>) => void;
  ytResults: YTResult;
  postVideo: any;
}> = ({ query, setQuery, ytResults, postVideo }) => {
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

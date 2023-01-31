import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const ytRouter = router({
  queryYTVideoInfoUsingID: publicProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(({ input }) => {
      const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${input?.query}&key=${process.env.YOUTUBE_API_KEY}`;
      const queryResponse = fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          return json;
        });
      return queryResponse;
    }),
  queryYTVideos: protectedProcedure
    .input(
      z.object({
        query: z.string(),
      })
    )
    .query(({ input }) => {
      console.log(" youtube videos", input);
      const keywordString = `${input?.query}`.replace(/\s/g, "+");
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${keywordString}&type=video&key=${process.env.YOUTUBE_API_KEY}`;
      // const queryResponse = mockAPIYT;
      const queryResponse = fetch(url)
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          return json;
        });

      return queryResponse;
    }),
});

const mockAPIYT = {
  kind: "youtube#searchListResponse",
  etag: "jm3npRcyw185ydcjPbEgqXKx1uA",
  nextPageToken: "CAUQAA",
  regionCode: "BR",
  pageInfo: {
    totalResults: 1000000,
    resultsPerPage: 5,
  },
  items: [
    {
      kind: "youtube#searchResult",
      etag: "kqkACulOHIZVJB8-p5rx_lOd-bc",
      id: {
        kind: "youtube#video",
        videoId: "_C7UgR_sIW0",
      },
      snippet: {
        publishedAt: "2014-11-24T16:00:06Z",
        channelId: "UCVtnG15ufdzur71RqfqNSOg",
        title: "Parov Stelar - All Night (Official Audio)",
        description:
          "Subscribe to our channel and click the bell to activate notifications: http://goo.gl/qYgqDF Shop/Listen here: ...",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/_C7UgR_sIW0/default.jpg",
            width: 120,
            height: 90,
          },
          medium: {
            url: "https://i.ytimg.com/vi/_C7UgR_sIW0/mqdefault.jpg",
            width: 320,
            height: 180,
          },
          high: {
            url: "https://i.ytimg.com/vi/_C7UgR_sIW0/hqdefault.jpg",
            width: 480,
            height: 360,
          },
        },
        channelTitle: "Parov Stelar",
        liveBroadcastContent: "none",
        publishTime: "2014-11-24T16:00:06Z",
      },
    },
    {
      kind: "youtube#searchResult",
      etag: "zI75iPNXbwt36GjTeOXAXEEO-x4",
      id: {
        kind: "youtube#video",
        videoId: "Eco4z98nIQY",
      },
      snippet: {
        publishedAt: "2012-01-25T13:13:27Z",
        channelId: "UCD6gqhbqonaUL8EAI3YzNnw",
        title: "Parov Stelar - Booty Swing",
        description: "Parov Stelar - Booty Swing.",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/Eco4z98nIQY/default.jpg",
            width: 120,
            height: 90,
          },
          medium: {
            url: "https://i.ytimg.com/vi/Eco4z98nIQY/mqdefault.jpg",
            width: 320,
            height: 180,
          },
          high: {
            url: "https://i.ytimg.com/vi/Eco4z98nIQY/hqdefault.jpg",
            width: 480,
            height: 360,
          },
        },
        channelTitle: "md05577",
        liveBroadcastContent: "none",
        publishTime: "2012-01-25T13:13:27Z",
      },
    },
    {
      kind: "youtube#searchResult",
      etag: "snhU-Bl6ihfLgNovoaWXjH2TCzc",
      id: {
        kind: "youtube#video",
        videoId: "Xd1xo1rjREM",
      },
      snippet: {
        publishedAt: "2015-07-31T12:27:06Z",
        channelId: "UCVtnG15ufdzur71RqfqNSOg",
        title: "Parov Stelar - Megamix",
        description:
          "Subscribe to our channel and click the bell to activate notifications: http://goo.gl/qYgqDF Shop/Listen/Follow here: ...",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/Xd1xo1rjREM/default.jpg",
            width: 120,
            height: 90,
          },
          medium: {
            url: "https://i.ytimg.com/vi/Xd1xo1rjREM/mqdefault.jpg",
            width: 320,
            height: 180,
          },
          high: {
            url: "https://i.ytimg.com/vi/Xd1xo1rjREM/hqdefault.jpg",
            width: 480,
            height: 360,
          },
        },
        channelTitle: "Parov Stelar",
        liveBroadcastContent: "none",
        publishTime: "2015-07-31T12:27:06Z",
      },
    },
    {
      kind: "youtube#searchResult",
      etag: "IJ_beeopwAzLCSh9WX1zWKScYbY",
      id: {
        kind: "youtube#video",
        videoId: "7fkOqXAHLKQ",
      },
      snippet: {
        publishedAt: "2012-03-15T23:06:16Z",
        channelId: "UCVtnG15ufdzur71RqfqNSOg",
        title: "Parov Stelar - Jimmy´s Gang (Official Video)",
        description:
          "Subscribe to our channel and click the bell to activate notifications: http://goo.gl/qYgqDF Shop/Listen here: ...",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/7fkOqXAHLKQ/default.jpg",
            width: 120,
            height: 90,
          },
          medium: {
            url: "https://i.ytimg.com/vi/7fkOqXAHLKQ/mqdefault.jpg",
            width: 320,
            height: 180,
          },
          high: {
            url: "https://i.ytimg.com/vi/7fkOqXAHLKQ/hqdefault.jpg",
            width: 480,
            height: 360,
          },
        },
        channelTitle: "Parov Stelar",
        liveBroadcastContent: "none",
        publishTime: "2012-03-15T23:06:16Z",
      },
    },
    {
      kind: "youtube#searchResult",
      etag: "5SBCM4ZQ23GJuv8bvI2TPM-PLZ0",
      id: {
        kind: "youtube#video",
        videoId: "WTrNsAsjEmY",
      },
      snippet: {
        publishedAt: "2014-06-13T08:28:55Z",
        channelId: "UCVtnG15ufdzur71RqfqNSOg",
        title: "Parov Stelar - The Sun (feat. Graham Candy) (Official Video)",
        description:
          "Subscribe to our channel and click the bell to activate notifications: http://goo.gl/qYgqDF Shop/Listen here: ...",
        thumbnails: {
          default: {
            url: "https://i.ytimg.com/vi/WTrNsAsjEmY/default.jpg",
            width: 120,
            height: 90,
          },
          medium: {
            url: "https://i.ytimg.com/vi/WTrNsAsjEmY/mqdefault.jpg",
            width: 320,
            height: 180,
          },
          high: {
            url: "https://i.ytimg.com/vi/WTrNsAsjEmY/hqdefault.jpg",
            width: 480,
            height: 360,
          },
        },
        channelTitle: "Parov Stelar",
        liveBroadcastContent: "none",
        publishTime: "2014-06-13T08:28:55Z",
      },
    },
  ],
};

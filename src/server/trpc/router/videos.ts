import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const videosRouter = router({
	postVideo: protectedProcedure
		.input( z.object({
			name: z.string(),
			link: z.string(),
			ytID: z.string(),
		}))
		.mutation(({ ctx, input }) => {
			console.log("input", input);
			const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${input?.ytID}&key=${process.env.YOUTUBE_API_KEY}`;
			const fetchYTData = fetch(url)
				.then((response) => {
					return response.json();
				})
				.then ((json) => {
					if (json.pageInfo.totalResults > 0) 
						return json.items[0]

				})
				.then((json) => {
					console.log(json.snippet.title)
					if(typeof(json.snippet.title) != "undefined") {
						return ctx.prisma.video.create({
							data: {
								name: json.snippet.title,
								link: `${input?.link}`,
								ytID: `${input?.ytID}`,
							}
						})
					} else {
						return ctx.prisma.video.create({
							data: {
								name: `${input?.name}`,
								link: `${input?.link}`,
								ytID: `${input?.ytID}`,
							}
						})
					}
				})

		}),
	playVideo: publicProcedure
		.input( z.object({
			id: z.string(),
			startedPlayingAt: z.number(),
		}))
		.mutation(({ ctx, input }) => {
			console.log("input", input);
			return ctx.prisma.video.update({
				where: {
					id: `${input?.id}`,
				},
				data: {
					started: true,
					startedPlayingAt: `${input?.startedPlayingAt}`,
				}
			})
		}),
	getAll: publicProcedure.query(({ ctx }) => {
		try {
			return ctx.prisma.video.findMany({
				orderBy: {
					createdAt: "asc",
				}
			});
		} catch(error) {
			console.log("error", error);
		}
	}),
	deleteVideo: protectedProcedure
		.input( z.object({
			id: z.string()
		}))
		.mutation(({ ctx, input }) => {
			return ctx.prisma.video.delete({
				where: {
					id: `${input?.id}`
				}
			})
		}),
});

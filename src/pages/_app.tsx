import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import Head from "next/head";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PlayerProvider } from "../contexts/PlayerContext";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <PlayerProvider>
        <Head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover"
          />

          <link
            href="/icons/favicon-48x48.png"
            rel="icon"
            type="image/png"
            sizes="48x48"
          />
          <meta name="theme-color" content="#2e026d" />
        </Head>
        <Component {...pageProps} />
      </PlayerProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);

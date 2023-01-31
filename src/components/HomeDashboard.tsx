import { useSession } from "next-auth/react";
import React from "react";
import { VideoPlayer } from "./VideoPlayer";

export const HomeDashboard = () => {
  const { data: sessionData } = useSession();

  return (
    <section className="min-h-[90vh] py-8">
      {sessionData?.user ? (
        <>
          <VideoPlayer />
        </>
      ) : (
        <h1>Please log in to use the platform</h1>
      )}
    </section>
  );
};

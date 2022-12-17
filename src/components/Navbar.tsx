import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { AuthShowcase } from "./AuthShowcase";
import { VideoPlaylist } from "./VideoPlaylist";
import YTQueryBox from "./ytQueryBox";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const { data: sessionData } = useSession();

  return (
    <nav className="navbar py-0 px-10 text-white">
      <div className="navbar-start">
        <button onClick={() => router.push("/")}>dr34m Radio</button>
      </div>

      <section className="navbar-center">
        <YTQueryBox />
      </section>

      <section className="navbar-end gap-4">
        {sessionData ? (
          <>
            <VideoPlaylist />
            <AuthShowcase sessionData={sessionData} />
          </>
        ) : (
          <button
            className="btn btn-accent min-w-max rounded-lg px-5 py-3 font-semibold text-white"
            onClick={() => signIn()}
          >
            Sign In
          </button>
        )}
      </section>
    </nav>
  );
};

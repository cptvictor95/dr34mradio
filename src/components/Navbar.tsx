import { useRouter } from "next/router";
import { AuthShowcase } from "./AuthShowcase";
import { VideoPlaylist } from "./VideoPlaylist";
import YTQueryBox from "./ytQueryBox";

export const Navbar: React.FC = () => {
  const router = useRouter();

  return (
    <nav className="navbar bg-base-100 py-0 px-10 text-white">
      <div className="navbar-start">
        <button onClick={() => router.push("/")}>dr34m Radio</button>
      </div>

					<div className="navbar-center" >
						<YTQueryBox />
					</div>

					<div className="navbar-end">
						<VideoPlaylist />
						<AuthShowcase  />
					</div>
				</nav>
    );
};

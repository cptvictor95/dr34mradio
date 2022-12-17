import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="z-10 flex flex-row items-center justify-center gap-4 rounded-full px-4 py-2 hover:cursor-pointer hover:backdrop-brightness-75">
      {sessionData && <span>{sessionData.user?.name}</span>}
      <div className="dropdown-bottom dropdown-end dropdown avatar z-10 w-12">
        <div tabIndex={0} className="w-12 rounded-full">
          {sessionData && (
            <Image
              alt={`${sessionData.user?.name}'s avatar`}
              width="48"
              height="48"
              src={sessionData.user?.image as string}
            />
          )}
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box border-2 border-gray-800 bg-gray-800 p-2"
        >
          <li>
            <button
              className="min-w-max rounded-lg px-10 py-3 font-semibold text-white no-underline transition hover:bg-gray-900"
              onClick={sessionData ? () => signOut() : () => signIn()}
            >
              {sessionData ? "Sign out" : "Sign in"}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};
